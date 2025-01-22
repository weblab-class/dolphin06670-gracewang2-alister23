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

//Creates a chart
router.post("", auth.ensureLoggedIn, (req, res) => {
  const newChart = new Chart({
    name: req.body.name,
    owner_id: req.user.googleid,
  });
  newChart.save().then((chart) => res.send(chart));
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
