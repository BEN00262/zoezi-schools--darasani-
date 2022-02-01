const { SchoolModel, TeacherModel, ClassModel, StudentModel, SubSubAccountModel } = require("../models");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { IsSchoolAuthenticated } = require("../configs");
const router = require("express").Router();

class ZoeziBaseError extends Error {
    constructor(message) {
        super(message)
    }
}

// here we deal with schools only ( tutadd verification later )
// should we just use the previous model ama ? i think so ( the school solution should be used beyond though )
// the frontend we should do it in remix my suggestion
router.post("/", async (req, res) => {
    try {
        // end the connection
        return res.end();
        
        let { name, email, location, mpesaNumber, password, confirmPassword } = req.body;

        if (!name || !email || !location || !mpesaNumber || !password || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Please fill all the required fields"
            })
        }

        // this aint working buana
        let salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        let school = await SchoolModel.create({ name, email, location, mpesaNumber, password })
        if (!school) {
            throw new ZoeziBaseError("Failed to create school account")
        }
        
        return res.status(201).json({ status: true })
    } catch(error) {

        console.log(error);
        return res.status(500).json({ 
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Uknown Error!"
        })
    }
})


router.put("/:schoolId", [ IsSchoolAuthenticated ], async (req, res) => {
    try {
        const { name, email, location, mpesaNumber, password, confirmPassword } = req.body;
        
        if (password) {
            let salt = await bcrypt.genSalt(10)
            pasword = await bcrypt.hash(password, salt)
        }

        await SchoolModel.findOneAndUpdate({ _id: req.params.schoolId }, {
            $set: {
                name: name || req.school.name,
                email: email || req.school.email,
                location: location || req.school.email,
                mpesaNumber: mpesaNumber || req.school.mpesaNumber,
                password: password || req.school.password
            }
        })

        return res.json({ status: true })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Uknown Error!"
        })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        let school = await SchoolModel.findOne({ email });

        if (!school) {
            return res.json({
                status: false,
                message: "Account does not exist. Please check your credentials and try again"
            })
        }

        let isMatch = await bcrypt.compare(password, school.password);

        if (!isMatch) {
            return res.json({
                status: false,
                message: "Account does not exist. Please check your credentials and try again"
            })
        }

        // JWT_SECRET ( we are signing with this )
        // create the jwt and return it
        let token = jwt.sign({ _id: school._id, school: true }, process.env.JWT_SECRET, {
            expiresIn: '72h' // after 3 days is more than enough for me
        });

        return res.json({ status: true, token });
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Uknown Error!"
        })
    }
})


// what data will we show at this point .. i dont know for now :(
// lets assume this aggregate the graphs data in the system i guess
// the general rise / fall per class progressively
router.get("/", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let grades_found = await ClassModel.aggregate([
            {
                $match: { schoolID: req.school._id.toString(), isClosed: false }
            }
        ]);

        // fetch the number of classes we have, the number of learners, and the number of teachers
        const [teachers, learners] = await Promise.all([
            TeacherModel.countDocuments({ schoolID: req.school._id }),
            SubSubAccountModel.aggregate([
                {
                    $match: { 
                        parentID: { $in: grades_found.map(x => x._id) },
                        schoolOrOrganizationID: req.school._id
                    }
                },
                {
                    $project: {
                        students: { $cond: { if: { $isArray: "$students" }, then: { $size: "$students" }, else: 0} }
                    }
                }
            ])
        ]);



        return res.json({ 
            school: req.school.name,
            metrics: {
                teachers, grades: grades_found.length, learners: learners.reduce((acc, x) => acc + x.students,0) 
            }
        })    
    } catch(error) {
        console.log(error)
        return res.status(500).json({})
    }
})


module.exports = router