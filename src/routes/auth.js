const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUPData } = require("../utils/validation");
const becrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req,res)=>{
    try{
        res.cookie('token', null, {
            expires: new Date( Date.now())
        });
        console.log(req);
        res.send(`${req.body?.firstName} logged out successfuly`)
    }catch(err){
        res.send(err.message);
    }
})

module.exports = { authRouter };
