const adminAuth = (req,res,next)=>{
    console.log("Middleware Called!!")
    const token = 'x3yz'
    if(token === 'xyz'){
        next();
    }
    else{
        res.status(401).send("Unauthorized token")
    }
}

module.exports = { adminAuth}