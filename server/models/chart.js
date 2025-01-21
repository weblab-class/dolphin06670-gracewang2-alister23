import Point from "./point";
const mongoose = require("mongoose");
const Point = require("./point");

const ChartSchema = new mongoose.Schema({
  name: String,
  likes: { type: Number, default: 0 },
  owner_id: String,
  left_axis: { type: String, default: "Left Axis" },
  right_axis: { type: String, default: "Right Axis" },
  top_axis: { type: String, default: "Top Axis" },
  bottom_axis: { type: String, default: "Bottom Axis" },
  points: { type: [mongoose.Schema.Types.ObjectId], ref: "Point", default: [] },
});

// compile model from schema
module.exports = mongoose.model("chart", ChartSchema);
