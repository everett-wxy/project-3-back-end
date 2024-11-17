const mongoose = require("mongoose");

const TripsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 1 },
    country: { type: String, required: true, minLength: 1 },
    city: { type: String, required: true, minLength: 1 },
    budget: { type: Number, required: true, minLength: 1 },
    days: { type: Number, required: true, minLength: 1 },
    flights: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      ref: "Flights",
    },
    accoms: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
      ref: "Hotels",
    },
    owner: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Auth",
    },
  },
  { collection: "trips" }
);

module.exports = mongoose.model("Trips", TripsSchema);
