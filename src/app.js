const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUPData } = require("./utils/validation");
const becrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, age, gender, password, skills, emailId } =
    req.body;

  try {
    validateSignUPData(req);
    const encrytedPassword = await becrypt.hash(req.body?.password, 10);
    user = new User({
      firstName,
      lastName,
      age,
      gender,
      emailId,
      password: encrytedPassword,
      skills,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      res.send("Login Successfull!");
    } else {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJwt();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/getUser", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(400).send("Data Not Found!");
    }
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

app.post("/sendConnectionReq", userAuth, async (req, res) => {
  res.send(`${req.user.firstName} Connection request sent successfully`);
});

connectDB()
  .then(() => {
    console.log("DB connection successful");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
