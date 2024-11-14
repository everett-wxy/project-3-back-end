const express = require("express");
const router = express.Router();
const {
  seedTrips,
  getAllTrips,
  getOneTrip,
  deleteOneTrip,
  updateOneTrip,
} = require("../controllers/trips");

router.get("/trips/seed", seedTrips);
router.get("/trips", getAllTrips);
router.post("/trips", getOneTrip);
router.delete("/trips", deleteOneTrip);
router.patch("/trips/:id", updateOneTrip);

module.exports = router;
