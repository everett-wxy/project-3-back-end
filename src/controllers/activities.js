const mongoose = require("mongoose");

const getActivitiesByCity = async (req, res) => {
  try {
    const activities = mongoose.connection.collection("Activities");
    const data = await activities.find({ city: req.body.city }).toArray();

    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      return res
        .status(400)
        .json({ status: "error", msg: "no activities found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting activities" });
  }
};

module.exports = { getActivitiesByCity };
