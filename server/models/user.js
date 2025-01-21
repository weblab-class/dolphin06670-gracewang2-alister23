// import Chart from "./chart"; (Got "SyntaxError: Cannot use import statement outside a module")
const mongoose = require("mongoose");
const Chart = require("./chart");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  charts: { type: [mongoose.Schema.Types.ObjectId], ref: "Chart" },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
