const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const  User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionReq = await ConnectionRequestModel.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender skills about");

    res.json({
      message: "Success",
      data: connectionReq,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row?.fromUserId._id?.toString() === loggedInUser._id?.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ message: "suceess", data: data });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page -1) * limit;

    const connectionReqs = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const userToIgnore = new Set();
    connectionReqs.forEach((req)=>{
        userToIgnore.add(req.fromUserId?.toString());
        userToIgnore.add(req.toUserId?.toString());
    })

    const users = await User.find({
        $and: [
            {_id :{$nin: Array.from(userToIgnore)}},
            {_id: {$ne: loggedInUser._id}}
        ]
    }).select(USER_SAFE_DATA).limit(limit).skip(skip);

    res.send(users);
    console.log(userToIgnore);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = {
  userRouter,
};
