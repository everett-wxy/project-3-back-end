const AuthModel = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    const users = await AuthModel.find();

    const outputArray = [];
    for (const user of users) {
      outputArray.push({ email: user.email, role: user.role });
    }

    res.json(outputArray);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting users" });
  }
};

const register = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ email: req.body.email });

    if (auth) {
      return res.status(400).json({ status: "error", msg: "duplicate email" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);

    await AuthModel.create({
      email: req.body.email,
      hash,
      role: req.body.role || "USER",
    });

    res.json({ status: "ok", msg: "user created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

const login = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ email: req.body.email });

    if (!auth) {
      return res.status(400).json({ status: "error", msg: "not authorised" });
    }

    const result = await bcrypt.compare(req.body.password, auth.hash);
    if (!result) {
      console.error("email or password error");
      return res
        .status(400)
        .json({ status: "error", msg: "email or password error" });
    }

    const claims = {
      email: auth.email,
      role: auth.role,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "15h",
      jwtid: uuidv4(),
    });

    // if not used, to delete
    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "15d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "login failed" });
  }
};

// if not used, to delete
const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const claims = { email: decoded.email, role: decoded.role };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "15d",
      jwtid: uuidv4(),
    });
    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refresh error" });
  }
};

module.exports = { getAllUsers, register, login, refresh };
