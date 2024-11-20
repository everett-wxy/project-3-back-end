const express = require("express");
const router = express.Router();
const {
  seedTrips,
  getAllTrips,
  getOneTrip,
  getOnePopulatedTrip,
  deleteOneTrip,
  updateOneTrip,
  addTrips,
  addAccomsToTrip,
  delAccomsFromTrip,
  addRestaurantsToTrip,
  delRestaurantsFromTrip,
  addActivitiesToTrip,
  delActivitiesFromTrip,
  addItineraryToTrip,
  deleteItineraryFromTrip,
  getAllItineraryFromTrip,
  getItineraryById,
} = require("../controllers/trips");

const {
  validateIdInBody,
  validateIdInParam,
  validateAddTripData,
} = require("../validators/trips");
const { checkErrors } = require("../validators/checkErrors");
const { auth, authAdmin } = require("../middleware/auth");

// router.get("/trips/seed", seedTrips); // authAdmin // Everett: no need
router.get("/trips", auth, getAllTrips);
router.get("/trips/:id", auth, validateIdInParam, checkErrors, getOneTrip);
// router.get("/trips/:id", auth, getOneTrip);
router.get("/onetrip/:id", auth, getOnePopulatedTrip);

router.delete("/trips", auth, validateIdInBody, checkErrors, deleteOneTrip);
router.patch("/trips/:id", auth, checkErrors, updateOneTrip);
router.put("/trips", auth, addTrips);

router.post("/trips/:id/accoms", auth, addAccomsToTrip);
router.delete("/trips/:id/accoms", auth, delAccomsFromTrip);

// restaurants
router.post("/trips/:id/restaurants", auth, addRestaurantsToTrip);
router.delete("/trips/:id/restaurants", auth, delRestaurantsFromTrip);

// activities
router.post("/trips/:id/activities", auth, addActivitiesToTrip);
router.delete("/trips/:id/activities", auth, delActivitiesFromTrip);

// itineraries
router.post("/trips/:id/itinerary", auth, addItineraryToTrip);
router.delete("/trips/:id/itinerary", auth, deleteItineraryFromTrip);
router.get("/trips/:id/itinerary", auth, getAllItineraryFromTrip);
router.post("/trips/:id/getOneItinerary", auth, getItineraryById);
module.exports = router;
