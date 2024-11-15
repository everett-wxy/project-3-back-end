const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  register,
  login,
  refresh,
} = require("../controllers/auth");

const {
  validateRegistrationData,
  validateLoginData,
  validateRefreshToken,
} = require("../validators/auth");

const { authAdmin } = require("../middleware/auth");

router.get("/users", authAdmin, getAllUsers);
router.put("/register", validateRegistrationData, register);
router.post("/login", validateLoginData, login);
router.post("/refresh", validateRefreshToken, refresh); // to delete if not used

module.exports = router;
