const TripsModel = require("../models/Trips");
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
      },
      {
        name: "CNY Getaway",
        country: "New Zealand",
        city: "Christchurch",
        budget: "7000",
        days: "10",
      },
      {
        name: "Birthday Trip",
        country: "Norway",
        city: "Tromso",
        budget: "10000",
        days: "10",
      },
    ]);

    res.json({ status: "ok", msg: "seeding successful" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "seeding error" });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const trips = await TripsModel.find();

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

const updateOneTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      res.status(400).json({ status: "error", msg: "invalid trip ID" });
    } else {
      const trip = await TripsModel.findById(tripId);

      if (trip) {
        await TripsModel.findByIdAndUpdate(tripId, {
          name: req.body.name || trip.name,
          country: req.body.country || trip.country,
          city: req.body.city || trip.city,
          budget: req.body.budget || trip.budget,
          days: req.body.days || trip.days,
        });
        res.json({ status: "ok", msg: "trip updated" });
      } else {
        res.status(400).json({ status: "error", msg: "no trip found" });
      }
    }
  } catch (error) {
    console.error(error.messsage);
    res.status(400).json({ status: "error", msg: "error updating trip" });
  }
};

module.exports = {
  seedTrips,
  getAllTrips,
  getOneTrip,
  deleteOneTrip,
  updateOneTrip,
};
