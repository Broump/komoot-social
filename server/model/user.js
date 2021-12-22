const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    komootEmail: { type: String, required: true },
    komootPassword: { type: Array, required: true },
    komootID: { type: String, required: true },
    friends: [String],
  },
  { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
