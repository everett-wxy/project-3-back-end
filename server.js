require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./src/db/db");

const trips = require("./src/routers/trips");
// const accommodations = require("./src/routers/accommodations");
// const activities = require("./src/routers/activities");
const flights = require("./src/routers/flights");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/p3", trips);
// app.use("/p3", accommodations);
// app.use("/p3", activities);
app.use("/p3", flights);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
