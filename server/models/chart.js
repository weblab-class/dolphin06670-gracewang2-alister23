import Point from "./point";
const mongoose = require("mongoose");
const Point = require("./point");

const ChartSchema = new mongoose.Schema({
  name: String,
  likes: Number,
  owner_id: String,
  left_axis: String,
  right_axis: String,
  top_axis: String,
  bottom_axis: String,
  points: { type: [mongoose.Schema.Types.ObjectId], ref: "Point" },
});

// compile model from schema
module.exports = mongoose.model("chart", ChartSchema);
