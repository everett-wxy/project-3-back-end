const { body, param } = require("express-validator");

const validateIdInBody = [
  body("id", "id is invalid").trim().notEmpty().isMongoId(),
];

const validateIdInParam = [param("id", "id is invalid").isMongoId()];

const validateAddTripData = [
  body("name", "name is required").trim().notEmpty(),
  body("name", "must have a length of at least 1 character").isLength({
    min: 1,
  }),

  body("country", "country is required").trim().notEmpty(),
  body("country", "must have a length of at least 1 character").isLength({
    min: 1,
  }),

  body("city", "city is required").trim().notEmpty(),
  body("city", "must have a length of at least 1 character").isLength({
    min: 1,
  }),
  body("budget", "budget is required").trim().notEmpty(),
  body("budget", "must have a length of at least 1 character").isLength({
    min: 1,
  }),
  body("days", "number of day(s) is required").trim().notEmpty(),
  body("days", "must have a length of at least 1 character").isLength({
    min: 1,
  }),
];

module.exports = { validateIdInBody, validateIdInParam, validateAddTripData };
