const express = require("express");
const router = express.Router();
const {
  getAccomsByCity,
  getAccomsById,
} = require("../controllers/accommodations");

router.post("/accoms", getAccomsByCity);
router.post("/accoms/id", getAccomsById);

module.exports = router;
