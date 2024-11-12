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

const getTrips = async (req, res) => {
  try {
    const trips = await TripsModel.find();

    if (trips.length > 0) {
      return res.json(trips);
    } else {
      res.status(400).json({ status: "error", msg: "no trips found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting trips" });
  }
};

module.exports = { seedTrips, getTrips };
