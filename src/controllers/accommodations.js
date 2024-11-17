const mongoose = require("mongoose");
const TripsModel = require("./trips");

const getAccomsByCity = async (req, res) => {
  try {
    const accoms = mongoose.connection.collection("Hotels");
    const data = await accoms.find({ city: req.body.city }).toArray();

    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      return res.status(400).json({ status: "error", msg: "no accoms found" });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ stage: "error", msg: "error getting accoms" });
  }
};

module.exports = { getAccomsByCity };
