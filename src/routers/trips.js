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
  delAccomsFromTrip,
  addRestaurantsToTrip,
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
router.get("/trips/:id", auth, validateIdInParam, checkErrors, getOneTrip);
router.delete("/trips", auth, validateIdInBody, checkErrors, deleteOneTrip);
router.patch("/trips/:id", auth, checkErrors, updateOneTrip);
router.put("/trips", auth, addTrips);

// router.put("/trips", auth, validateAddTripData, checkErrors, addTrips);
router.post("/trips/:id/accoms", auth, addAccomsToTrip);
router.delete("/trips/:id/accoms", auth, delAccomsFromTrip);

// restaurants
router.post("/trips/:id/restaurants", auth, addRestaurantsToTrip);

module.exports = router;
