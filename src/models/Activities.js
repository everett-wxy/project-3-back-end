const mongoose = require("mongoose");

const ActivitiesSchema = new mongoose.Schema(
  {
    // details here
    name: { type: String, required: true },
  },
  { collection: "activities" }
);

module.exports = mongoose.model(ActivitiesSchema);
