const mongoose = require("mongoose");

const AccommodationsSchema = new mongoose.Schema(
  {
    // details here
    city: { type: String, required: true },
    hotelName: { type: String, required: true },
    hotelPrice: { type: Number, required: true },
    roomType: { type: String, required: true },
    hotelAddress: { type: String, required: true },
    tier: { type: String, required: true },
    imageOne: { type: String, required: true },
    imageTwo: { type: String, required: true },
  },
  { collection: "Hotels" }
);

module.exports = mongoose.model("Hotels", AccommodationsSchema);

