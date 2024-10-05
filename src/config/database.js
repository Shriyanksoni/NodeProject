const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://piyushsoni024:Soni%40123@cluster0.sel61.mongodb.net/DevTinder');
};

module.exports = connectDB