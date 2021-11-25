const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("./model/user");

mongoose.connect(
  "mongodb+srv://Broump:daniel11@cluster0.slhya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);

const app = express();

{
  /* app.use("/", express.static(path.join(__dirname, "static"))); */
}
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Server" });
});

app.post("/api/change-password", async (req, res) => {
  const { token, newpassword: plainTextPassword } = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password to small. Should be atleast 6 characters",
    });
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword, 10);
    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

app.post("/api/register", async (req, res) => {
  const { username, password: PlainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid Username" });
  }

  if (!PlainTextPassword || typeof PlainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }

  if (PlainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password to small. Should be atleast 6 characters",
    });
  }

  const password = await bcrypt.hash(PlainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error == 11000) {
      //duplicate Key
      return res.json({ status: "error", error: "Username already in use" });
    } else {
      throw error;
    }
  }

  res.json({ status: "ok" });
});

app.listen(9999, () => {
  console.log("Server is running on PORT 9999");
});
