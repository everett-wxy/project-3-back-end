const mongoose = require("mongoose");

const getRestaurantsByCity = async (req, res) => {
  try {
    const restaurants = mongoose.connection.collection("Restaurants");
    const data = await restaurants.find({ city: req.body.city }).toArray();

    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ status: "error", msg: "no restaurant found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "error getting restaurant" });
  }
};

module.exports = { getRestaurantsByCity };
