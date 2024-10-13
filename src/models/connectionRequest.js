const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        required: true,
        enum : {
            values: ['ignored','accepted','rejected','interested'],
            message: `{VALUE} is incorrect status type`
        }
    },
}, {timestamps: true});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre('save', function(next){
    const connectionReq = this;

    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error('Sender and Reciever cannot be same!');
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = { ConnectionRequestModel}