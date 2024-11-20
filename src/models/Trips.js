const mongoose = require("mongoose");

const ItinerariesSchema = new mongoose.Schema({
    depPort: String,
    depDate: String,
    depTime: String,
    arrPort: String,
    arrDate: String,
    arrTime: String,
    class: String,
    duration: String,
    price: Number,
    flightType: String,
    flightCarrier: String,
    isReturn: Boolean,
});

const TripsSchema = new mongoose.Schema(
    {
        name: { type: String, default: "Unamed Trip" },
        country: { type: String, default: "" },
        city: { type: String, default: "" },
        budget: { type: Number, default: 0 },
        days: { type: Number, default: 0 },
        flights: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
            ref: "Flights",
        },
        itineraries: [ItinerariesSchema],
        accoms: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
            ref: "Hotels",
        },
        restaurants: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
            ref: "Restaurants",
        },
        activities: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
            ref: "Activities",
        },
        owner: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            ref: "Auth",
        },
    },
    { collection: "trips" }
);

module.exports = mongoose.model("Trips", TripsSchema);

