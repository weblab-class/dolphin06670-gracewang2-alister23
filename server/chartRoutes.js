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
router.post("/create", (req, res) => {
  console.log("Received request to create chart: ", req.body);

  if (!req.body.name || !req.body.owner_id) {
    console.error("Missing required fields (name or owner_id).");
    return res.status(400).json({ error: "Missing required fields (name or googleid)." });
  }
  const newChart = new Chart({
    name: req.body.name,
    owner_id: req.body.owner_id, // Here, owner_id is just the regular _id of the user.
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

// Returns status (public or not) of chart given ID
router.get("/status/:id", (req, res) => {
  Chart.find({ _id: req.params.id }).then((chart) => res.send({ isPublic: chart.isPublic }));
});

// Makes a chart public or private
router.put("/status/:id", async (req, res) => {
  const status = req.body.status;
  try {
    const chart = await Chart.findById(req.params.id);
    if (!chart) {
      console.error("Couldn't find chart when making chart public or private");
      return res
        .status(404)
        .send({ message: "Chart not found (when trying to make chart public or private)" });
    }
    chart.isPublic = status === "public"; // chart.public is a boolean
    await chart.save();
    console.log("Logging chart.public in the API endpoint (after put)", chart.isPublic);
    res.status(200).send({ message: "Chart status (public or private) updated successfully" });
  } catch (err) {
    res.status(500).send({ message: "An error occurred" });
  }
});

// Shares a chart with a user
router.put("/share", async (req, res) => {
  const { chartId, email, permission } = req.body;
  try {
    // Get chart
    const chart = await Chart.findById(chartId);
    if (!chart) {
      return res.status(404).send({ message: "Chart not found" });
    }

    // Get user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update permission
    if (permission === "view") {
      if (!chart.can_view.includes(user._id)) {
        chart.can_view.push(user._id);
      }
      // Also, if user is in can_edit, remove them
      chart.can_edit = chart.can_edit.filter((id) => id !== user._id);
    } else if (permission === "edit") {
      if (!chart.can_edit.includes(user._id)) {
        chart.can_edit.push(user._id);
      }

      if (!chart.can_view.includes(user._id)) {
        chart.can_view.push(user._id);
      } else {
        return res
          .status(400)
          .send({ message: "Permission isn't view or edit, which means something is wrong." });
      }
    }
  } catch (err) {
    console.error("Oops! Something went wrong when sharing chart: ", err);
    res.status(500).send({ message: "Failed to share chart" });
  }
});

// Returns name of chart given ID
router.get("/name/:id", (req, res) => {
  Chart.find({ _id: req.params.id }).then((chart) => res.send(chart.name));
});

// Fetches current list of points for a given chart
router.get("/:id/points", (req, res) => {
  Point.find({ parent: req.query.parent }).then((points) => {
    res.send(points);
  });
});

//Returns chart given ID
router.get("/:id", (req, res) => {
  Chart.find({ _id: req.query.id }).then((chart) => res.send(chart));
});

//Edits a chart
router.put("/:id", (req, res) => {
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

//Add a like to a chart
router.put("/:id/like", async (req, res) => {
  try {
    const chartId = req.params.id;
    const result = await Chart.findById(chartId);
    // res.status(200).json({ message: result.likes });
    result.likes += 1;
    console.log("liked chart");
    await result
      .save()
      .then((chart) => {
        console.log("Likes: ", chart.likes);
        res.status(201).json(chart);
      })
      .catch((err) => {
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to like" }); // Ensure only one response is sent
        }
      });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//Remove your like from a chart
router.put("/:id/unlike", async (req, res) => {
  try {
    const chartId = req.params.id;
    const result = await Chart.findById(chartId);
    // res.status(200).json({ message: result.likes });
    result.likes -= 1;
    console.log("unliked chart");
    await result
      .save()
      .then((chart) => {
        console.log("Likes: ", chart.likes);
        res.status(201).json(chart);
      })
      .catch((err) => {
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to unlike" }); // Ensure only one response is sent
        }
      });
    return true;
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred" });
  }
});

//When the top axis label changes
router.put("/:id/top", async (req, res) => {
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
router.put("/:id/left", async (req, res) => {
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
router.put("/:id/right", async (req, res) => {
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

//When the bottom axis label changes
router.put("/:id/bottom", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  // Chart.deleteOne(req.params.id);
  //To do: Make sure it only deletes if owner_id == existing id
  const chartId = req.params.id;
  const userId = req.user._id;

  Chart.deleteOne({ _id: chartId, owner_id: userId })
    .then(() => res.send({ message: "Chart deleted successfully!" }))
    .catch((err) => res.status(500).send({ error: "Oh no! Failed to delete chart." }));

  // Update user's list of charts by removing chartId from list of charts (via $pull)
  const update = await User.updateOne({ _id: userId }, { $pull: { charts: chartId } });
  if (update.nModified === 0) {
    return res.status(404).send({ message: "User not found or chart not in user's list" });
  }
});

// Submit chart -> add to user's list of charts
router.post("/submit", (req, res) => {
  const chartId = req.body.chartId;
  const userId = req.body.userId;
  console.log("Received request to /api/chart/submit: ", req.body);

  User.findById(userId)
    .then((user) => {
      console.log("Found user: ", user);
      if (!user) {
        console.error("Couldn't find user when submitting chart to user's list");
        return res.status(404).send({ message: "User not found" });
      }
      user.charts.push(chartId);
      res.send(user);
    })
    .catch((err) => {
      console.error("Error when submitting chart to user's list: ", err);
      res.status(500).send({ message: "Failed to add chart to user's list" });
    });
});

module.exports = router;
