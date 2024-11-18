const express = require("express");
const router = express.Router();
const { getActivitiesByCity } = require("../controllers/activities");

router.post("/activities", getActivitiesByCity);

module.exports = router;
