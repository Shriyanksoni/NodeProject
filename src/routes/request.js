const express = require("express");
const requestRouter = express.Router();
const {ConnectionRequestModel} = require('../models/connectionRequest')
const {userAuth} = require("../middleware/auth");
const User = require('../models/user');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try{
    
  const status = req?.params?.status

  const toUserId = req?.params?.toUserId

  const fromUserId = req.user.id;

  const allowedStatus = ['ignored','interested'];
  if(!allowedStatus.includes(status)){
    throw new Error('Invalid status type');
  }

  const isUserExist = await User.findById(toUserId);
  if(!isUserExist){
    throw new Error('User does not exists!');
  }

  const isExistingReq = await ConnectionRequestModel.findOne({
    $or : [
      {fromUserId, toUserId},
      {fromUserId: toUserId, toUserId: fromUserId}
    ]
  });
  if(isExistingReq){
    throw new Error('Connection request already exists!');
  }

  const connectionReq = new ConnectionRequestModel({
    fromUserId,
    toUserId,
    status
  });

  await connectionReq.save();
  res.send('Connection Request Set Successfully')
}catch(err){
  res.status(400).send(err.message);
}
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res)=>{
  try{
  const loggedInUser = req.user;

  const { status }  = req.params;

  const allowedStatus = ['accepted','rejected'];
  if(!allowedStatus.includes(status)){
    return res.status(400).send("Invalid status type");
  }
  const connectionReq = await ConnectionRequestModel.findOne({
    _id : req.params.requestId,
    toUserId: loggedInUser._id,
    status: 'interested',
  });
  if(!connectionReq){
    return res.status(400).send('Connection Request not found!');
  }

  connectionReq.status = status;

  const data = await connectionReq.save();

  res.json({message: `Request ${status} successfully`, data: data});
}catch(err){
  res.send(err.message);
}
})

module.exports = { requestRouter };
