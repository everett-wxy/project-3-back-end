const express = require("express");
const router = express.Router();
const { getRestaurantsByCity } = require("../controllers/restaurants");

router.post("/restaurants", getRestaurantsByCity);

module.exports = router;
