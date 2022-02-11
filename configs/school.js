const jwt = require("jsonwebtoken");
const { SchoolModel } = require("../models")

module.exports = async (req, res, next) => {
    let authToken = req.headers["authorization"];

    if(!authToken){
        return res.status(403).json({ message:"Authorization required" })
    }

    authToken = authToken.split(" ")[1]

    try{
        let decoded =  await jwt.verify(authToken, process.env.JWT_SECRET);

        if(!decoded){
            throw new Error("nothing..."); // we dont give a fuck here though
        }

        if (!decoded.school) {
            return res.status(403).json({ message:"Authorization required" })
        }

        req.school = await SchoolModel.findOne({ _id:decoded._id });
        return next();
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Unknown error. Contact the admin for more info"})
    }
}