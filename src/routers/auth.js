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

const { checkErrors } = require("../validators/checkErrors");
const { authAdmin } = require("../middleware/auth");

router.get("/users", authAdmin, checkErrors, getAllUsers);
router.put("/register", validateRegistrationData, checkErrors, register);
router.post("/login", validateLoginData, checkErrors, login);
router.post("/refresh", validateRefreshToken, checkErrors, refresh); // to delete if not used

module.exports = router;
