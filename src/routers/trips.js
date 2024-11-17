const express = require("express");
const router = express.Router();
const {
  seedTrips,
  getAllTrips,
  getOneTrip,
  deleteOneTrip,
  updateOneTrip,
  addTrips,
  addAccomsToTrip,
} = require("../controllers/trips");

const {
  validateIdInBody,
  validateIdInParam,
  validateAddTripData,
} = require("../validators/trips");
const { checkErrors } = require("../validators/checkErrors");
const { auth, authAdmin } = require("../middleware/auth");

router.get("/trips/seed", seedTrips); // authAdmin
router.get("/trips", auth, getAllTrips);
router.post("/trips", auth, validateIdInBody, checkErrors, getOneTrip);
router.delete("/trips", auth, validateIdInBody, checkErrors, deleteOneTrip);
router.patch("/trips/:id", auth, checkErrors, updateOneTrip);
router.put("/trips", auth, validateAddTripData, checkErrors, addTrips);
router.post("/trips/:id/accoms", addAccomsToTrip);

module.exports = router;
