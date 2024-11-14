const TripsModel = require("../models/Trips");
const FlightModel = require("../models/Flights");
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
        flights: "673614c82c8e253c94047cf9",
      },
      {
        name: "CNY Getaway",
        country: "New Zealand",
        city: "Christchurch",
        budget: "7000",
        days: "10",
        flights: "673614c82c8e253c94047cfa",
      },
      {
        name: "Birthday Trip",
        country: "Norway",
        city: "Tromso",
        budget: "10000",
        days: "10",
        flights: "673614c82c8e253c94047cfb",
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
    const trips = await TripsModel.find().populate("flights"); // Populate the 'flights' field
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
      res.status(400).json({ status: "error", msg: "invalid trip ID" });
    } else {
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
        res.status(400).json({ status: "error", msg: "no trip found" });
      }
    }
  } catch (error) {
    console.error(error.messsage);
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
      });
      await newTrip.save();
      res.json({ status: "ok", msg: "trip added" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error adding trip" });
  }
};

module.exports = {
  seedTrips,
  getAllTrips,
  getOneTrip,
  deleteOneTrip,
  updateOneTrip,
  addTrips,
};
