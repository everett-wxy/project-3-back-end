const TripsModel = require("../models/Trips");
const FlightModel = require("../models/Flights");
const AuthModel = require("../models/Auth");
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
    const trips = await TripsModel.find({ owner: user._id }).populate("owner");
    // .populate("flights")// Populate the 'flights' field
    // .populate("accommodations") // Populate the 'accommodations' field
    // .populate("activities"); // Populate the 'activities' field

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
    const tripId = req.body.id;

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
  // if the trip name, and city is the same, then will throw error because duplicate entry. Did not put country on assumption you can plan more than one city in the country (stretch goal if doing more than one city in a country)

  /* 
  e.g:
  1st entry - name: "Birthday trip", country: "Japan". city: "Tokyo"
  2nd entry - name: "Birthday trip", country: "Japan", city: "Osaka"
  */

  // ben to add in blank fields check

  try {
    const user = await AuthModel.findOne({ email: req.decoded.email });
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    const existingTrip = await TripsModel.findOne({
      name: req.body.name,
      city: req.body.city,
    });

    if (existingTrip) {
      res.status(400).json({
        status: "error",
        msg: "A trip with the same name and city exists",
      });
    } else {
      const newTrip = new TripsModel({
        name: req.body.name,
        country: req.body.country,
        city: req.body.city,
        budget: req.body.budget,
        days: req.body.days,
        owner: user._id,
      });
      await newTrip.save();
      res.json({ status: "ok", msg: "trip added" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "error adding trip" });
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

module.exports = {
  seedTrips,
  getAllTrips,
  getOneTrip,
  deleteOneTrip,
  updateOneTrip,
  addTrips,
  addAccomsToTrip,
};
