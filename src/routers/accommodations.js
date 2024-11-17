const express = require("express");
const router = express.Router();
const { getAccomsByCity } = require("../controllers/accommodations");
// const {} = require("../controllers/accommodations");

router.post("/accoms", getAccomsByCity);

module.exports = router;
