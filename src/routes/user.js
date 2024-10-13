const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");

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
      .populate("fromUserId", "firstName lastName age gender about skills")
      .populate("toUserId", "firstName lastName age gender about skills");

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

module.exports = {
  userRouter,
};
