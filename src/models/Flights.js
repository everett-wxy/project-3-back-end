const mongoose = require("mongoose");

const FlightsSchema = new mongoose.Schema(
  {
    // details here
    name: { type: String, required: true },
  },
  { collection: "flights" }
);

module.exports = mongoose.model("Flights", FlightsSchema);
