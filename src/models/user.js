const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const becrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, 'Minimum 3 characters required'],
    maxLength: [20, 'Maximum 20 characters allowed'],
    trim: true,
  },
  lastName: {
    type: String,
    minLength: [3, 'Minimum 3 characters required'],
    maxLength: [20, 'Maximum 20 characters allowed'],
    trim: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: { 
     validator:   (value)=>{
        var re = new RegExp("[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}")
        return re.test(value)
    },
    message: (prop)=>{
       return `${prop.value} is not a valid emilId`
    }
}
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password must contains atleast 8 characters'],
  },
  age: {
    type: Number,
    min: [18, 'Minimum age allowed is 18']
  },
  gender: {
    type: String,
    validate(value){
        if(!['male','female'].includes(value)){
            throw new Error('Gender is not valid!');
        }
    }
},
skills: {
    type: [String],
    validate(value){
        if(value?.length > 10){
            throw new Error('Maximum Skills allowed is 10');
        }
    }
},
photoUrl: {
    type: String,
    trim: true,
}
},{timestamps: true});

userSchema.methods.getJwt = async function(){
  const user = this

  const token = await jwt.sign({_id: user?._id}, 'POINT@6200', {expiresIn: "7d"});

  return token;
}

userSchema.methods.validatePassword = async function(userInputPassword){
  const user = this
  const passwordHash = user?.password
  const isPasswordValid = await becrypt.compare(userInputPassword, passwordHash);

  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);
