/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const Chart = require("./models/chart");
const Point = require("./models/point");
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

//import chartRoutes file
const chartRoutes = require("./chartRoutes");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// Middleware to populate current user
router.use(auth.populateCurrentUser);

// Middleware to ensure that the user is logged in
router.use(auth.ensureLoggedIn);

// Use chartRoutes for all routes starting with "/api/chart"
router.use("/chart", chartRoutes);

// Check if an email (user) exists
router.get("/user_exists/:email", (req, res) => {
  const email = req.params.email;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      res.send({ exists: true });
    } else {
      res.send({ exists: false });
    }
  });
});

//Gets all charts
router.get("/all_charts", (req, res) => {
  Chart.find({}).then((charts) => res.send(charts)); //Eventually change this to only private charts
});

// Gets all public charts
router.get("/public_charts", (req, res) => {
  Chart.find({ isPublic: true })
    .then((charts) => {
      res.send(charts);
    })
    .catch((err) => {
      console.error("There was an issue trying to get all public charts: ", err);
      res.status(500).send({ message: "Failed to get public charts" });
    });
});

// Fetch user details (by ID)
router.get("/user/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Wanted to get user through ID, but user not found." });
      }
      res.send(user);
    })
    .catch((err) => {
      console.error("Failed to get user by ID: ", err);
      res.status(500).send({ message: "Failed to get user by ID" });
    });
});

//Gets charts made by current user
router.get("/my_charts", (req, res) => {
  // Chart.find({ owner_id: req.user.googleid }).then((charts) => res.send(charts));
  Chart.find({ owner_id: req.query.userId }).then((charts) => res.send(charts));
});

//Returns point given ID
router.get("/point/:id", (req, res) => {
  Point.find({ _id: req.query.id }).then((point) => res.send(point));
});

//Creates a point
router.post("/point", (req, res) => {
  const newPoint = Point({
    name: req.body.name,
    x_coord: req.body.x_coord,
    y_coord: req.body.y_coord,
    parent: req.body.parent,
  });
  console.log("Bruh");
  console.log(newPoint.name);
  console.log(newPoint.x_coord);
  console.log(newPoint.y_coord);
  newPoint.save().then((comment) => res.send(comment));
});

//Edits a point
router.put("/point/:id", (req, res) => {
  // If we have time, let's figure out how to add fields to req.body
  const { name, x_coord, y_coord } = req.body;

  //To do: Make sure it only updates if owner_id == existing id
  Point.updateOne(
    { _id: req.query.id },
    {
      $set: {
        name: name,
        x_coord: x_coord,
        y_coord: y_coord,
      },
    }
  );
});

//Deletes a point

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
