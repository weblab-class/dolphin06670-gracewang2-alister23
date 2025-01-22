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
router.post("/create", (req, res) => {
  if (!req.body.name || !req.user.googleid) {
    return res.status(400).send({ error: "Missing required fields (name or googleid)." });
  }
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

//When the top axis label changes
router.put("/:id/top", auth.ensureLoggedIn, async (req, res) => {
  const { top_axis } = req.body;

  try {
    const chartId = req.params.id;
    if (!chartId || top_axis === undefined) {
      return res.status(400).send({ message: "Invalid input" });
    }
    const result = await Chart.updateOne({ _id: chartId }, { $set: { top_axis: top_axis } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//When the left axis label changes
router.put("/:id/left", auth.ensureLoggedIn, async (req, res) => {
  const { left_axis } = req.body;

  try {
    const chartId = req.params.id;
    if (!chartId || left_axis === undefined) {
      return res.status(400).send({ message: "Invalid input" });
    }
    const result = await Chart.updateOne({ _id: chartId }, { $set: { left_axis: left_axis } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//When the right axis label changes
router.put("/:id/right", auth.ensureLoggedIn, async (req, res) => {
  const { right_axis } = req.body;

  try {
    const chartId = req.params.id;
    if (!chartId || right_axis === undefined) {
      return res.status(400).send({ message: "Invalid input" });
    }
    const result = await Chart.updateOne({ _id: chartId }, { $set: { right_axis: rigjt_axis } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//When the top axis label changes
router.put("/:id/bottom", auth.ensureLoggedIn, async (req, res) => {
  const { bottom_axis } = req.body;

  try {
    const chartId = req.params.id;
    if (!chartId || bottom_axis === undefined) {
      return res.status(400).send({ message: "Invalid input" });
    }
    const result = await Chart.updateOne({ _id: chartId }, { $set: { bottom_axis: bottom_axis } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//Deletes a chart
router.delete("/:id", auth.ensureLoggedIn, (req, res) => {
  Chart.deleteOne(req.params.id);
  //To do: Make sure it only deletes if owner_id == existing id
});

module.exports = router;
