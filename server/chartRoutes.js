//
// Contains all api calls involving making, editing, or deleting individual charts
//

const express = require("express");

// import models so we can interact with the database
const Chart = require("./models/chart");
const Point = require("./models/point");
const User = require("./models/user");

const auth = require("./auth");

const router = express.Router();

// Right now, the problem is that auth.ensureLoggedin is sending a response before the response is sent
// which is why there's an error. In the future, we should make sure auth.ensureLoggedIn actually renders
// something on the page so that users know to sign in. If they don't sign in, then nothing works because
// two responses are being sent.
// (for reference, I was getting an error about HTTP headers being sent twice, which is because of authentication)
// "API request's result could not be converted to a JSON object" -> authentication problem (related to above)
// "ReferenceError: Can't find variable: post" -> import {get, post} from "../../utilities"; is missing

//Creates a chart
router.post("/create", auth.ensureLoggedIn, (req, res) => {
  const newChart = new Chart({
    name: req.body.name,
    owner_id: req.body.owner_id,
  });

  newChart
    .save()
    .then((chart) => {
      console.log("Chart created: ", chart);
      res.status(201).json(chart);
    })
    .catch((err) => {
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to create chart" }); // Ensure only one response is sent
      }
    });
});

// Fetches current list of points for a given chart
router.get("/:id/points", auth.ensureLoggedIn, (req, res) => {
  Point.find({ parent: req.query.parent }).then((points) => {
    res.send(points);
  });
});

//Returns chart given ID
router.get("/:id", auth.ensureLoggedIn, (req, res) => {
  Chart.find({ _id: req.query.id }).then((chart) => res.send(chart));
});

//Edits a chart
router.put("/:id", auth.ensureLoggedIn, (req, res) => {
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

//Deletes a chart
router.delete("/:id", auth.ensureLoggedIn, (req, res) => {
  Chart.deleteOne(req.params.id);
  //To do: Make sure it only deletes if owner_id == existing id
});

module.exports = router;
