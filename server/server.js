const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { encrypt, decrypt } = require("./helper/crypto.js");
const axios = require("axios");

const { spawn } = require("child_process");

const User = require("./model/user");

mongoose.connect(
  "mongodb+srv://Broump:daniel11@cluster0.slhya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
  if (!req.body.email) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return { status: "error", error: "Invalid username/password" };
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("User is logged in");
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  if (!req.body.username || typeof req.body.username !== "string") {
    return res.json({ status: "error", error: "Invalid Username" });
  }

  if (!req.body.email || typeof req.body.email !== "string") {
    return res.json({ status: "error", error: "Invalid Email" });
  }

  if (!req.body.password || typeof req.body.password !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  if (req.body.password.length < 5) {
    return res.json({
      status: "error",
      error: "Password to small. Should be atleast 6 characters",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const encryptedPassword = await encrypt(req.body.komootPassword);

    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      komootEmail: req.body.komootEmail,
      komootPassword: encryptedPassword,
      komootID: req.body.komootID,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.get("/api/user-data", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({
      status: "ok",
      username: user.username,
      email: user.email,
      komootID: user.komootID,
    });
  } catch (error) {
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/isauth", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    if (user) {
      return res.json({
        status: "ok",
      });
    }
  } catch (error) {
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/all-tours", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    komootEmail = user.komootEmail;
    komootID = user.komootID;
    komootPassword = decrypt(user.komootPassword[0]);

    queryObj = {
      komootEmail: komootEmail,
      komootID: komootID,
      komootPassword: komootPassword,
    };

    const childPython = spawn("python3", [
      "getTourData.py",
      "allTours",
      komootID,
      komootEmail,
      komootPassword,
    ]);

    childPython.stdout.on("data", (data) => {
      res.json(JSON.parse(data.toString("utf8")));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on PORT 3001");
});
