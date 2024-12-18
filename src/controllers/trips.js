const TripsModel = require("../models/Trips");
const AuthModel = require("../models/Auth");
const RestaurantsModel = require("../models/restaurants");
const ActivitiesModel = require("../models/Activities");
const AccommodationsModel = require("../models/Accommodations");

const mongoose = require("mongoose");
const Trips = require("../models/Trips");

const getAllTrips = async (req, res) => {
  //by user.
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const trips = await TripsModel.find({ owner: user._id })
      .populate("owner")
      .populate("restaurants")
      .populate("activities")
      .populate("accoms");

    if (trips.length > 0) {
      return res.json(trips);
    } else {
      return res.status(400).json({ status: "error", msg: "no trips found" });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ status: "error", msg: "error getting trips" });
  }
};

const getOnePopulatedTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ status: "error", msg: "invalid trip ID" });
    } else {
      const trip = await TripsModel.findById(tripId)
        .populate("owner")
        .populate("restaurants")
        .populate("activities")
        .populate("accoms");

      if (trip) {
        res.json(trip);
      } else {
        res.status(400).json({ status: "error", msg: "no trips found" });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "error", msg: "error getting trips" });
  }
};

const getOneTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ status: "error", msg: "invalid trip ID" });
    } else {
      const trip = await TripsModel.findById(tripId);

      if (trip) {
        res.json(trip);
      } else {
        res.status(400).json({
          status: "error",
          msg: "no trips found",
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ status: "error", msg: "error getting trips" });
  }
};

const deleteOneTrip = async (req, res) => {
  try {
    const tripId = req.body.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      res.status(400).json({ status: "error", msg: "invalid trip ID" });
    } else {
      const trip = await TripsModel.findById(tripId);

      if (trip) {
        await TripsModel.findByIdAndDelete(tripId);
        res.json({ status: "ok", msg: "trip deleted" });
      } else {
        res.status(400).json({ status: "error", msg: "no trip found" });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: " error deleting trip" });
  }
};

const updateOneTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ status: "error", msg: "invalid trip ID" });
    }
    const trip = await TripsModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({ status: "error", msg: "ino trip found" });
    }

    const updateTrip = {};
    if ("name" in req.body) updateTrip.name = req.body.name;
    if ("country" in req.body) updateTrip.country = req.body.country;
    if ("city" in req.body) updateTrip.city = req.body.city;
    if ("budget" in req.body) updateTrip.budget = req.body.budget;
    if ("days" in req.body) updateTrip.days = req.body.days;

    await TripsModel.findByIdAndUpdate(
      tripId,
      { $set: updateTrip },
      { new: true }
    );
    res.json({ status: "ok", msg: "trip updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "error updating trip" });
  }
};

const addTrips = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const createTrip = {};
    if ("name" in req.body) createTrip.name = req.body.name;
    if ("country" in req.body) createTrip.country = req.body.country;
    if ("city" in req.body) createTrip.city = req.body.city;
    if ("budget" in req.body) createTrip.budget = req.body.budget;
    if ("days" in req.body) createTrip.days = req.body.days;

    const createdTrip = new TripsModel({
      ...createTrip,
      owner: user._id,
    });
    await createdTrip.save();
    res.status(200).json({ createdTrip });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ status: "error", msg: error.message });
  }
};

const addAccomsToTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    //trip id -planboard should have paramsid Accom id req.param.id accomsId
    const trip = await TripsModel.findById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", msg: "Trip ID not found" });
    }
    const accoms = await mongoose.connection
      .collection("Hotels")
      .findOne({ _id: new mongoose.Types.ObjectId(req.body.accomsId) });
    if (!accoms) {
      return res
        .status(404)
        .json({ status: "error", msg: "Accoms ID not found" });
    }

    if (trip.accoms.includes(req.body.accomsId)) {
      return res.status(409).json({
        status: "error",
        msg: "Accommodation already added to trip",
      });
    }

    trip.accoms.push(req.body.accomsId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "accoms added" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "error", msg: "error adding accoms" });
  }
};

const delAccomsFromTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    const trip = await TripsModel.findById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", msg: "Trip ID not found" });
    }
    const accoms = await mongoose.connection
      .collection("Hotels")
      .findOne({ _id: new mongoose.Types.ObjectId(req.body.accomsId) });
    if (!accoms) {
      return res
        .status(404)
        .json({ status: "error", msg: "Accoms ID not found" });
    }

    trip.accoms.pull(req.body.accomsId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "accoms deleted" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: "error", msg: "error deleting accoms" });
  }
};

// Restaurant Codes
const addRestaurantsToTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    //trip id -planboard should have paramsid Restaurants id req.param.id restaurantId
    const trip = await TripsModel.findById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", msg: "Trip ID not found" });
    }

    const restaurants = await mongoose.connection
      .collection("Restaurants")
      .findOne({
        _id: new mongoose.Types.ObjectId(req.body.restaurantId),
      });
    if (!restaurants) {
      return res
        .status(404)
        .json({ status: "error", msg: "Restaurant ID not found" });
    }

    if (trip.restaurants.includes(req.body.restaurantId)) {
      return res.status(400).json({
        status: "error",
        msg: "Restaurant already added to trip",
      });
    }

    trip.restaurants.push(req.body.restaurantId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "restaurant added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "error adding restaurants",
    });
  }
};

const delRestaurantsFromTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    const trip = await TripsModel.findById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", msg: "Trip ID not found" });
    }

    const restaurants = await mongoose.connection
      .collection("Restaurants")
      .findOne({
        _id: new mongoose.Types.ObjectId(req.body.restaurantId),
      });
    if (!restaurants) {
      return res
        .status(404)
        .json({ status: "error", msg: "Restaurant ID not found" });
    }

    trip.restaurants.pull(req.body.restaurantId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "restaurant deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "error deleting restaurants",
    });
  }
};

// Activities Codes
const addActivitiesToTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    //trip id -planboard should have paramsid Activities id req.param.id activitiesId
    const trip = await TripsModel.findById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", msg: "Trip ID not found" });
    }

    const activities = await mongoose.connection
      .collection("Activities")
      .findOne({
        _id: new mongoose.Types.ObjectId(req.body.activitiesId),
      });
    if (!activities) {
      return res
        .status(404)
        .json({ status: "error", msg: "Activities ID not found" });
    }

    if (trip.activities.includes(req.body.activitiesId)) {
      return res.status(400).json({
        status: "error",
        msg: "Activities already added to trip",
      });
    }

    trip.activities.push(req.body.activitiesId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "activities added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      msg: "error adding activities",
    });
  }
};

const delActivitiesFromTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    const trip = await TripsModel.findById(req.params.id);
    if (!trip) {
      return res
        .status(404)
        .json({ status: "error", msg: "Trip ID not found" });
    }

    const activities = await mongoose.connection
      .collection("Activities")
      .findOne({
        _id: new mongoose.Types.ObjectId(req.body.activitiesId),
      });
    if (!activities) {
      return res
        .status(404)
        .json({ status: "error", msg: "Activities ID not found" });
    }

    trip.activities.pull(req.body.activitiesId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "activities deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "ok", msg: "error deleting activites" });
  }
};

const addItineraryToTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });

    if (!user) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    const { id } = req.params; // getting trip Id from params
    const itinerary = req.body.itinerary; // getting itinerary data from request body

    const updatedTrip = await TripsModel.findByIdAndUpdate(
      id,
      { $push: { itineraries: itinerary } }, // adding itinerary to array
      { new: true } // return updated document
    );
    if (!updatedTrip) {
      return res.status(404).send({ message: "trip id not found" });
    }
    const newItineraryId =
      updatedTrip.itineraries[updatedTrip.itineraries.length - 1]._id;
    res.status(200).json({
      status: "ok",
      msg: "itinerary added",
      itineraryId: newItineraryId,
      updatedTrip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating trip with itinerary" });
  }
};

const deleteItineraryFromTrip = async (req, res) => {
  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });

    if (!user) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    const { id } = req.params;
    const { itineraryId } = req.body;
    if (!itineraryId) {
      return res
        .status(400)
        .json({ status: "error", msg: "Itinerary ID required" });
    }

    const updatedTrip = await TripsModel.findByIdAndUpdate(
      id,
      { $pull: { itineraries: { _id: itineraryId } } },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).send({ message: "Trip not found" });
    }

    res.status(200).json({
      status: "ok",
      msg: "Itinerary removed",
      updatedTrip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error removing itinerary" });
  }
};

const getAllItineraryFromTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await TripsModel.findById(id, "itineraries");

    if (!trip) {
      return res.status(404).json({ status: "error", msg: "Trip not found" });
    }

    res.status(200).json({
      status: "ok",
      msg: "itinerary retrieved",
      itineraries: trip.itineraries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving itineraries" });
  }
};

const getItineraryById = async (req, res) => {
  try {
    const { id } = req.params; // Trip ID
    const { itineraryId } = req.body; // Itinerary ID

    const trip = await TripsModel.findById(id);

    if (!trip) {
      return res.status(404).json({ status: "error", msg: "Trip not found" });
    }

    const itinerary = trip.itineraries.id(itineraryId);

    if (!itinerary) {
      return res
        .status(404)
        .json({ status: "error", msg: "Itinerary not found" });
    }

    res.status(200).json({
      status: "ok",
      msg: "Itinerary retrieved",
      itinerary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving itinerary" });
  }
};

module.exports = {
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
};
