const validator = require('validator')

const validateSignUPData =  (req)=>{
    const { firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    } else if(!validator.isStrongPassword(password)){
        throw new Error('Please enter a strong password');
    }
    else if(req.body?.photoUrl && !validator.isURL(req.body?.photoUrl)){
        throw new Error("Photo URL is not correct!")
    }
};

module.exports = {
    validateSignUPData
}