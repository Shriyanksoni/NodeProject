const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
const { authRouter } = require("./routes/auth");
const { requestRouter } = require("./routes/request");
const { profileRouter } = require("./routes/profile");
const { userRouter } = require("./routes/user");

app.use("/", authRouter, requestRouter, profileRouter, userRouter);

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

connectDB()
  .then(() => {
    console.log("DB connection successful");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
