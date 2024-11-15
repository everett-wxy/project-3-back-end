const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  register,
  login,
  refresh,
} = require("../controllers/auth");

router.get("/users", getAllUsers);
router.put("/register", register);
router.post("/login", login);
router.post("/refresh", refresh); // to delete if not used

module.exports = router;
