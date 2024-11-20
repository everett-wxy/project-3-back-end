const FlightsModel = require("../models/Flights");
const mongoose = require("mongoose");
const { getFlightData } = require("../services/flightService");

const validateFlightQuery = (req, res, next) => {
    const { origin, destination, departureDate, cabinClass } = req.query;

    // Ensure all required query params are provided
    if (!origin || !destination || !departureDate || !cabinClass) {
        return res.status(400).json({
            error: "Missing required fields. Please provide origin, destination, departureDate, and cabinClass.",
        });
    }

    console.log("origin: ", origin);
    

    // Optional: You can validate origin and destination as before
    const validCities = {
        singapore: "SIN",
        istanbul: "IST",
        tromsø: "TOS",
        tromso: "TOS",
        christchurch: "CHC",
        sapporo: "CTS",
        cairo: "CAI",
        sin: "SIN",
        ist: "IST",
        tos: "TOS",
        chc: "CHC",
        cts: "CTS",
        cai: "CAI",
    };

    const originInput = validCities[origin.toLowerCase()];
    const destinationInput = validCities[destination.toLowerCase()];

    if (!originInput) {
        console.log('origin input: ', originInput);
        return res.status(400).json({ error: "Invalid origin city." });
    }

    if (!destinationInput) {
        return res.status(400).json({ error: "Invalid destination city." });
    }

    // Validate dates (departureDate must be today or later)
    const today = new Date().toISOString().split("T")[0];
    if (new Date(departureDate) < new Date(today)) {
        return res
            .status(400)
            .json({ error: "Departure date must be today or later." });
    }

    // If all validation passes, continue to the next handler
    next();
};

const fetchFlights = async (req, res) => {
    try {
        const { origin, destination, departureDate, cabinClass } = req.query;
        const flightData = await getFlightData(
            origin,
            destination,
            departureDate,
            cabinClass
        );
        res.json(flightData);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch flight data",
            message: error.message,
        });
    }
};

const seedFlights = async (req, res) => {
    try {
        await FlightsModel.deleteMany({});

        await FlightsModel.create([
            {
                name: "SQ 638",
                country: "Japan",
                city: "Tokyo",
                departure_date: "22/12/2024",
                departure_time: "2355",
                departure_time_country: "Singapore",
                cost: "1200",
            },
            {
                name: "SQ 295",
                country: "New Zealand",
                city: "Christchurch",
                departure_date: "28/1/2025",
                departure_time: "0915",
                departure_time_country: "Singapore",
                cost: "3141",
            },
            {
                name: "SQ 322",
                country: "Norway",
                city: "Tromso",
                departure_date: "30/4/2025",
                departure_time: "2345",
                departure_time_country: "Singapore",
                cost: "5045",
            },
        ]);

        res.json({ status: "ok", msg: "seeding successful" });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ status: "error", msg: "seeding error" });
    }
};

const getAllFlights = async (req, res) => {
    try {
        const flights = await FlightsModel.find();

        if (flights.length > 0) {
            return res.json(flights);
        } else {
            return res
                .status(400)
                .json({ status: "error", msg: "no flights found" });
        }
    } catch (error) {
        console.error(error.message);
        return res
            .status(400)
            .json({ stage: "error", msg: "error getting flights" });
    }
};

module.exports = {
    getAllFlights,
    seedFlights,
    fetchFlights,
    validateFlightQuery,
};
