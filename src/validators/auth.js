const { body } = require("express-validator");

const validateRegistrationData = [
  body("email", "valid email is required").trim().notEmpty().isEmail(),
  body("password", "password is required with min length of 10")
    .trim()
    .notEmpty()
    .isLength({ min: 10 }),
];

const validateLoginData = [
  body("email", "valid email is required").trim().notEmpty().isEmail(),
  body("password", "password is required").notEmpty(),
];

const validateRefreshToken = [
  body("refresh", "valid refresh token is required").notEmpty().isJWT(),
];

module.exports = {
  validateRegistrationData,
  validateLoginData,
  validateRefreshToken,
};
