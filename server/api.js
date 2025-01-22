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
router.use("/chart", chartRoutes);

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

//Middleware

//Not-middleware (endware?)

//Gets all charts
router.get("/all_charts", auth.ensureLoggedIn, (req, res) => {
  Chart.find({}).then((charts) => res.send(charts)); //Eventually change this to only private charts
});

//Gets charts made by current user
router.get("/my_charts", auth.ensureLoggedIn, (req, res) => {
  Chart.find({ owner_id: req.user.googleid }).then((charts) => res.send(charts));
});

//Returns point given ID
router.get("/point/:id", auth.ensureLoggedIn, (req, res) => {
  Chart.find({ _id: req.query.id }).then((point) => res.send(point));
});

//Creates a point
router.post("/point", auth.ensureLoggedIn, (req, res) => {
  const newPoint = new Chart({
    name: req.body.name,
    x_coord: req.body.x_coord,
    y_coord: req.body.y_coord,
  });
  newPoint.save().then((comment) => res.send(comment));
});

//Edits a point
router.put("/chart/:id", auth.ensureLoggedIn, (req, res) => {
  const { name, likes, owner_id, left_axis, right_axis, top_axis, bottom_axis, points } = req.body;

  //To do: Make sure it only updates if owner_id == existing id
  Chart.updateOne(
    { _id: req.query.id },
    {
      $set: {
        name: name,
        likes: likes,
        owner_id: owner_id,
        left_axis: left_axis,
        right_axis: right_axis,
        top_axis: top_axis,
        bottom_axis: bottom_axis,
        points: points,
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
