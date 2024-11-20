const mongoose = require("mongoose");

const ActivitiesSchema = new mongoose.Schema(
  {
    // details here
    city: { type: String, required: true },
    activityName: { type: String, required: true },
    activityPrice: { type: Number, required: true },
    activityDescription: { type: String, required: true },
    activityLocation: { type: String, required: true },
    tier: { type: String, required: true },
    imageOne: { type: String, required: true },
  },
  { collection: "Activities" }
);

module.exports = mongoose.model("Activities", ActivitiesSchema);