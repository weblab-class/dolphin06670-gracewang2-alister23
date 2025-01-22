const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  name: String,
  x_coord: Number,
  y_coord: Number,
  parent: String, // ID of the chart this point belongs to
});

// compile model from schema
module.exports = mongoose.model("point", PointSchema);
