const mongoose = require("mongoose");

const RestaurantsSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    restaurant: { type: String, required: true },
    foodPrice: { type: Number, required: true },
    foodDescription: { type: String, required: true },
    openingHours: { type: String, required: true },
    restaurantAddress: { type: String, required: true },
    tier: { type: String, required: true },
    imageOne: { type: String, required: true },
  },
  { collection: "Restaurants" }
);

module.exports = mongoose.model("Restaurants", RestaurantsSchema);
