const TripsModel = require("../models/Trips");
const FlightModel = require("../models/Flights");
const AuthModel = require("../models/Auth");
const RestaurantsModel = require("../models/restaurants");
const ActivitiesModel = require("../models/Activities");
const AccommodationsModel = require("../models/Accommodations");

const mongoose = require("mongoose");

const seedTrips = async (req, res) => {
  try {
    await TripsModel.deleteMany({});

    await TripsModel.create([
      {
        name: "White Christmas",
        country: "Japan",
        city: "Tokyo",
        budget: "5000",
        days: "7",
        flights: "6736af60ee6c19031d9fee76",
        owner: "67379e0ff3692f9300930a52",
      },
      {
        name: "CNY Getaway",
        country: "New Zealand",
        city: "Christchurch",
        budget: "7000",
        days: "10",
        flights: "6736af60ee6c19031d9fee77",
        owner: "67379e0ff3692f9300930a52",
      },
      {
        name: "Birthday Trip",
        country: "Norway",
        city: "Tromso",
        budget: "10000",
        days: "10",
        flights: "6736af60ee6c19031d9fee78",
        owner: "67379e0ff3692f9300930a52",
      },
    ]);

    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seeding error" });
  }
};

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
    // .populate("flights")// Populate the 'flights' field

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
        res.status(400).json({ status: "error", msg: "no trips found" });
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

// need to figure out how to update flights.
const updateOneTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ status: "error", msg: "invalid trip ID" });
    }
    const trip = await TripsModel.findById(tripId);
    const updatedFlight = await FlightModel.findByIdAndUpdate(
      trip.flights._id,
      { name: req.body.flights.name },
      { new: true }
    );

    if (trip) {
      await TripsModel.findByIdAndUpdate(tripId, {
        name: req.body.name || trip.name,
        country: req.body.country || trip.country,
        city: req.body.city || trip.city,
        budget: req.body.budget || trip.budget,
        days: req.body.days || trip.days,
      });

      await FlightModel.findByIdAndUpdate(
        trip.flights._id,
        { name: req.body.flights.name },
        { new: true }
      );
      res.json({ status: "ok", msg: "trip updated" });
    } else {
      return res.status(400).json({ status: "error", msg: "no trip found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error updating trip" });
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
    // }
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
      return res
        .status(409)
        .json({ status: "error", msg: "Accommodation already added to trip" });
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
      .findOne({ _id: new mongoose.Types.ObjectId(req.body.restaurantId) });
    if (!restaurants) {
      return res
        .status(404)
        .json({ status: "error", msg: "Restaurant ID not found" });
    }

    if (trip.restaurants.includes(req.body.restaurantId)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Restaurant already added to trip" });
    }

    trip.restaurants.push(req.body.restaurantId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "restaurant added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "error adding restaurants" });
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
      .findOne({ _id: new mongoose.Types.ObjectId(req.body.restaurantId) });
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
    res
      .status(500)
      .json({ status: "error", msg: "error deleting restaurants" });
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
      .findOne({ _id: new mongoose.Types.ObjectId(req.body.activitiesId) });
    if (!activities) {
      return res
        .status(404)
        .json({ status: "error", msg: "Activities ID not found" });
    }

    if (trip.activities.includes(req.body.activitiesId)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Activities already added to trip" });
    }

    trip.activities.push(req.body.activitiesId);
    await trip.save();
    res.status(200).json({ status: "ok", msg: "activities added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "error adding activities" });
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
      .findOne({ _id: new mongoose.Types.ObjectId(req.body.activitiesId) });
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

module.exports = {
  seedTrips,
  getAllTrips,
  getOneTrip,
  deleteOneTrip,
  updateOneTrip,
  addTrips,
  addAccomsToTrip,
  delAccomsFromTrip,
  addRestaurantsToTrip,
  delRestaurantsFromTrip,
  addActivitiesToTrip,
  delActivitiesFromTrip,
};
