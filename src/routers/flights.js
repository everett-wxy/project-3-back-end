const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  seedFlights,
  fetchFlights,
} = require("../controllers/flights");

// Evertt: No need for seedFlights and getAllFlights 
// router.get("/flights/seed", seedFlights);
// router.get("/flights", getAllFlights);

router.get("/flights", validateFlightQuery, fetchFlights);

module.exports = router;
