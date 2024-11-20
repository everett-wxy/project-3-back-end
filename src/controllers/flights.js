const mongoose = require("mongoose");
const { getFlightData } = require("../services/flightService");

const validateFlightQuery = (req, res, next) => {
    const { origin, destination, departureDate, cabinClass } = req.query;

    if (!origin || !destination || !departureDate || !cabinClass) {
        return res.status(400).json({
            error: "Missing required fields. Please provide origin, destination, departureDate, and cabinClass.",
        });
    }
    
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

module.exports = {
    fetchFlights,
    validateFlightQuery,
};
