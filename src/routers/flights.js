const express = require("express");
const router = express.Router();
const {
  getAllFlights,
  seedFlights,
  fetchFlights,
} = require("../controllers/flights");

router.get("/flights/seed", seedFlights);
// router.get("/flights", getAllFlights);
router.get("/flights", fetchFlights);

module.exports = router;
