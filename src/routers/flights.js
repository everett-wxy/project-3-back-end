const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  seedFlights,
  fetchFlights,
  validateFlightQuery
} = require("../controllers/flights");


router.get("/flights", validateFlightQuery, fetchFlights);

module.exports = router;
