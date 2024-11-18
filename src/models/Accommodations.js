const mongoose = require("mongoose");

const HotelsSchema = new mongoose.Schema({}, { collection: "Hotels" });

module.exports = mongoose.model("Hotels", HotelsSchema);
