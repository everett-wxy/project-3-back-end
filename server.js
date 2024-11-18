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
const auth = require("./src/routers/auth");
const roles = require("./src/routers/roles");
const accoms = require("./src/routers/accommodations");
const restaurants = require("./src/routers/restaurants");

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

app.use("/WanderGoWhere", trips);
app.use("/WanderGoWhere", accoms);
app.use("/WanderGoWhere", restaurants);
// app.use("/WanderGoWhere", activities);
app.use("/WanderGoWhere", flights);
app.use("/WanderGoWhere", auth);
app.use("/WanderGoWhere", roles);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
