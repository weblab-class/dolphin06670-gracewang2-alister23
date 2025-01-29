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

//Gets all charts
router.get("/all_charts", (req, res) => {
  Chart.find({}).then((charts) => res.send(charts)); //Eventually change this to only private charts
});

//Gets charts made by current user
router.get("/my_charts", (req, res) => {
  // Chart.find({ owner_id: req.user.googleid }).then((charts) => res.send(charts));
  Chart.find({ owner_id: req.query.userId }).then((charts) => res.send(charts));
});

// Gets the mapping between chart ID and whether the user has liked the chart
router.get("/user/like/:id", (req, res) => {
  // :id should be user ID
  User.find({ _id: req.params.id }).then((user) => res.send(user.userLiked));
});

// Like a chart by updating userLiked field
router.put("/user/like/:id", async (req, res) => {
  // :id should be chart ID
  // pass in user ID
  try {
    const userId = req.query.userId;
    const result = await User.findById(userId);
    result.userLiked[req.params.id] = true;
    await result
      .save()
      .then((user) => res.status(201).json(user))
      .catch((err) => res.status(500).json({ error: "Found user but failed to like." }));
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Oops! Seems like there was an error liking the chart." });
  }
});

// Unlike a chart by updating userLiked field
router.put("/user/unlike/:id", async (req, res) => {
  // :id should be chart ID
  // pass in user ID
  try {
    const userId = req.query.userId;
    const result = await User.findById(userId);
    result.userLiked[req.params.id] = false;
    await result
      .save()
      .then((user) => res.status(201).json(user))
      .catch((err) => res.status(500).json({ error: "Found user but failed to unlike." }));
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Oops! Seems like there was an error unliking the chart." });
  }
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
