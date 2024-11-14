const express = require("express");
const router = express.Router();
const { getAllFlights, seedFlights } = require("../controllers/flights");

router.get("/flights/seed", seedFlights);
router.get("/flights", getAllFlights);

module.exports = router;
