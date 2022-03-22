const jwt = require("jsonwebtoken");
const { TeacherModel, SchoolModel } = require("../models");

// this scopes under a teacher but also fetches the school :)
module.exports = async (req, res, next) => {
    let authToken = req.headers["authorization"];

    if(!authToken){
        return res.status(403).json({ message:"Authorization required" })
    }

    authToken = authToken.split(" ")[1]

    try{
        let decoded =  await jwt.verify(authToken, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(403).json({ message:"Authorization required" }); // we dont give a fuck here though
        }

        // if its a school just resolve it :)
        if (decoded.school) {
            req.school = await SchoolModel.findOne({ _id:decoded._id });
            return next();
        }

        let teacher = await TeacherModel.findOne({ _id:decoded._id }).populate('schoolID');

        // the school and the teacher ( we can ue the teacher stuff later :) )
        req.school = teacher.schoolID;
        req.teacher = teacher;

        return next();
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Unknown error. Contact the admin for more info"})
    }
}