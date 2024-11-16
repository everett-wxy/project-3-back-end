const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    username: { type: String, default: "user" },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "auth" }
);

module.exports = mongoose.model("Auth", AuthSchema);
