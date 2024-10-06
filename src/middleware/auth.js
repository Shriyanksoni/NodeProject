const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token Not Found");
    }

    //verifying token 
    const { _id } = await jwt.verify(token, "POINT@6200");

    //getting user form the DB
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    //attaching user to req body
    req.user = user;

    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { userAuth };
