const express = require("express");
const router = express.Router();
const { seedTrips, getAllTrips, getOneTrip } = require("../controllers/trips");

router.get("/trips/seed", seedTrips);
router.get("/trips", getAllTrips);
router.post("/trips", getOneTrip);

module.exports = router;
