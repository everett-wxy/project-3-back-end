const express = require("express");
const router = express.Router();
const { seedTrips, getTrips } = require("../controllers/trips");

router.get("/trips/seed", seedTrips);
router.get("/trips", getTrips);

module.exports = router;
