const Roles = require("../models/Roles");

const getAllRoles = async (req, res) => {
  try {
    const roles = await Roles.find();
    const rolesArray = roles.map((item) => {
      return item.role;
    });
    res.json(rolesArray);
  } catch (error) {
    console.error(error.messge);
    res.status(400).json({ status: "error", msg: "error getting all roles" });
  }
};

module.exports = { getAllRoles };
