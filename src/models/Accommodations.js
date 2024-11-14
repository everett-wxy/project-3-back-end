const mongoose = require("mongoose");

const AccommodationsSchema = new mongoose.Schema(
  {
    // details here
    name: { type: String, required: true },
  },
  { collection: accommodations }
);

module.exports = mongoose.model("Accommodations", AccommodationsSchema);
