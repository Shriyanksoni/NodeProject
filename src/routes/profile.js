const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditData } = require("../utils/validation");
const User = require('../models/user');
const becrypt = require('bcrypt')

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditData(req)) {
      throw new Error("Edit can't be performed!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save()
    res.send(`${loggedInUser?.firstName} Profile updated successfuly`);
  } catch (err) {
    res.send(err.message);
  }
});


profileRouter.post("/profile/forgotPassword", userAuth, async(req, res)=>{
  try{
    const _id = req?.user?._id;
    const user = await User.findById(_id);
    const isPasswordValid = await user.validatePassword(req?.body?.currentPassword);
    if(isPasswordValid){
      const encrytedPassword = await becrypt.hash(req.body?.newPassword, 10);
      user.password = encrytedPassword;
      user.save();
      res.send("Password updated successfuly");
    }
    else{
      res.status(400).send("Current password is inccorect");
    }

  }catch(err){
    res.send(err.message);
  }
})

module.exports = { profileRouter };
