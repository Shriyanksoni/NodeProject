const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validator = require("validator")

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  user = new User(req.body);

  try {
    if(req.body?.photoUrl && !validator.isURL(req.body?.photoUrl)){
        throw new Error("Photo URL is not correct!")
    }
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.log(err);
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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body?.id;
  try {
    await User.findByIdAndDelete(userId);
    res.end("User deleted successfully");
  } catch (err) {
    res.send(500).status("Something went wrong!");
  }
});

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "password",
      "photoUrl"
    ];
    const canUpdate = Object.keys(req.body).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!canUpdate) {
      throw new Error("Can not update these fields.");
    }
    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("User data updated successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
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
