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
  "mongodb+srv://Broump:YOXVKJ3kjFZ0Qut1@cluster0.slhya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
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

    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.post("/api/register", async (req, res) => {
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
      res.json(data.toString("utf8"));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/get-feed", async (req, res) => {
  try {
    const childPython = spawn("python3", ["getTourData.py", "getFeed"]);

    childPython.stdout.on("data", (data) => {
      res.json(data.toString("utf8"));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/search", async (req, res) => {
  const search = req.headers["search"];
  try {
    const childPython = spawn("python3", ["getTourData.py", "search", search]);

    childPython.stdout.on("data", (data) => {
      res.json(data.toString("utf8"));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid search" });
  }
});

app.get("/api/howOftenSport", async (req, res) => {
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
      "howOftenSport",
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

app.get("/api/HowOftenSportsFriend", async (req, res) => {
  const friendEmail = req.headers["friendemail"];

  try {
    const user = await User.findOne({ email: friendEmail });

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
      "howOftenSport",
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

app.get("/api/totalSportValues", async (req, res) => {
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
      "getTotalSportValues",
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

app.get("/api/totalSportValuesFriend", async (req, res) => {
  const friendEmail = req.headers["friendemail"];

  try {
    const user = await User.findOne({ email: friendEmail });

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
      "getTotalSportValues",
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

app.get("/api/totalSportValuesPerYear", async (req, res) => {
  const token = req.headers["x-access-token"];
  const year = req.headers["year"];

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
      "getTotalSportValues",
      komootID,
      komootEmail,
      komootPassword,
      year,
    ]);

    childPython.stdout.on("data", (data) => {
      res.json(JSON.parse(data.toString("utf8")));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/toursInMonthPerYear", async (req, res) => {
  const token = req.headers["x-access-token"];
  const year = req.headers["year"];

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
      "toursInMonthPerYear",
      komootID,
      komootEmail,
      komootPassword,
      year,
    ]);

    childPython.stdout.on("data", (data) => {
      res.json(JSON.parse(data.toString("utf8")));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/toursInMonthPerYearFriend", async (req, res) => {
  const friendEmail = req.headers["friendemail"];
  const year = req.headers["year"];

  try {
    const user = await User.findOne({ email: friendEmail });

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
      "toursInMonthPerYear",
      komootID,
      komootEmail,
      komootPassword,
      year,
    ]);

    childPython.stdout.on("data", (data) => {
      res.json(JSON.parse(data.toString("utf8")));
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/search-user", async (req, res) => {
  const userToFind = req.headers["user"];

  try {
    const user = await User.findOne({ username: userToFind });

    return res.json({
      username: user.username,
      email: user.email,
    });

    
  } catch (error) {
    res.json({ status: "error", error: "user not found" });
  }
});

app.get("/api/delete-friend", async (req, res) => {
  const friendToDelete = req.headers["usertodelete"];
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    const friend = await User.findOne({ email: friendToDelete });

    const deleteuser = await User.findOneAndUpdate(
      { email: user.email },
      { $pull: { friends: {email: friend.email, username: friend.username} } }
    )
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/add-friend", async (req, res) => {
  const friendEmail = req.headers["email"];
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    const friend = await User.findOne({ email: friendEmail });
    
    const adduser = await User.findOneAndUpdate(
      { email: user.email },
      { $push: { friends: {email: friend.email, username: friend.username} } }
    )
    
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/list-friends", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({
      listOfFriends: user.friends,
    });

    
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.get("/api/update-tour", async (req, res) => {
  const token = req.headers["x-access-token"];
  const is_private = req.headers["is_private"];
  const tour_text = req.headers["tour_text"];
  const tour_id = req.headers["tour_id"];

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
      "updateTour",
      komootID,
      komootEmail,
      komootPassword,
      is_private,
      tour_id,
      tour_text,
    ]);

    childPython.stdout.on("data", (data) => {
      console.log(data);
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invlaid token" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on PORT 3001");
});
