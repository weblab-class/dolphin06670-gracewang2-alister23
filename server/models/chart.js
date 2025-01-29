// import Point from "./point"; (Got "SyntaxError: Cannot use import statement outside a module")
const mongoose = require("mongoose");
const Point = require("./point");
const User = require("./user");

const ChartSchema = new mongoose.Schema({
  name: { type: String, default: "New Chart" },
  likes: { type: Number, default: 0 },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  left_axis: { type: String, default: "Left Axis" },
  right_axis: { type: String, default: "Right Axis" },
  top_axis: { type: String, default: "Top Axis" },
  bottom_axis: { type: String, default: "Bottom Axis" },
  points: { type: [mongoose.Schema.Types.ObjectId], ref: "Point", default: [] },

  isPublic: { type: Boolean, default: false },
  can_edit: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] }, // Set when creating a new chart
  can_view: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
});

// compile model from schema
module.exports = mongoose.model("Chart", ChartSchema);
