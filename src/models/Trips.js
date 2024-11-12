const mongoose = require("mongoose");

const TripsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    budget: { type: Number, required: true },
    days: { type: Number, required: true },
  },
  { collection: "trips" }
);

module.exports = mongoose.model("Trips", TripsSchema);
