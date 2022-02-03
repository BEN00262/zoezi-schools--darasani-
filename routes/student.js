const { IsSchoolAuthenticated } = require("../configs");
const { 
    StudentModel, SubSubAccountModel, 
    ClassRef, specialPaperHistoryModel, UserDataModel,
} = require("../models");

const yup = require("yup");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid"); // for unique username and password generation
const bcrypt = require("bcryptjs");
const moment = require("moment");
const humanTime = require("human-time");
const CryptoJS = require("crypto-js");
const { convertToJson, multerUploader } = require("../utils");
const router = require("express").Router();

const pipeline = (x) => [
    {
        $match:{
            studentID: x._id.toString(),
            subsubAccountID: x.sub_sub_accounts[0]._id.toString()
        }
    },
    {
        "$sort": { "updatedAt": -1 }
    },
    { "$limit": 1 },
]

// create a learner, get analytics of the learner and a bunch of other stuffs
// we are going to do that
router.get("/profile/:studentId", [IsSchoolAuthenticated], async (req, res) => {
    try {

        let student = await StudentModel.findOne({ 
            _id: mongoose.Types.ObjectId(req.params.studentId )
        });

        // we need to get the student or else we return a 404
        if (!student) {
            return res.status(404).json({
                status: false,
                message: `Student '${req.params.studentId}' does not exist`
            })
        }

        return res.json({ student })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Unknown Error!"
        })   
    }
})
// fetch the analytics somewhere else
router.get("/:studentId", async (req, res) => {
    try {
        let student = await StudentModel.findOne({ 
            _id: mongoose.Types.ObjectId(req.params.studentId )
        });

        // we need to get the student or else we return a 404
        if (!student) {
            return res.status(404).json({
                status: false,
                message: `Student '${req.params.studentId}' does not exist`
            })
        }

        // get the last active time now ( and show it )
        let [special_time, normal_time] = await Promise.all([
            specialPaperHistoryModel.aggregate(pipeline(student)),
            UserDataModel.aggregate(pipeline(student))
        ])

        let lastTime = [...special_time, ...normal_time].map(y => y.updatedAt).filter(x => x);
        
        // getting the latest time
        lastTime = lastTime.length > 0 ? lastTime.reduce(
            (a, b) => moment(a).isAfter(moment(b)) ? a : b
        ) : null;

        return res.json({ 
            status: true,
            student: {
                // get the credentials of the student ( we will fetch the activity of the student later )
                firstname: student.firstname,
                lastname: student.lastname,
                username: student.username,
                lastActive: lastTime ? humanTime(lastTime): "never",
    
                password: CryptoJS.AES.decrypt(
                    student.encryptedPassword, process.env.AES_ENCRYPTION_KEY
                ).toString(CryptoJS.enc.Utf8)
            }
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Unknown Error!"
        })
    }
})

class ZoeziBaseError extends Error {
    constructor(message) {
        super(message)
    }
}

router.post("/:classId/:classRefId", [IsSchoolAuthenticated], async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // we can get a school's name from the system
        const { firstname, lastname, gender } = req.body;

        if (!firstname || !lastname || !gender ) {
            return res.status(400).json({
                status: false,
                message: "Please enter all the required fields"
            })
        }

        if (!["boy", "girl"].includes(gender)) {
            return res.status(400).json({
                status: false,
                message: `'${gender}' unrecognized as a gender`
            })
        }

        // generate the unique username ( uuid ) and the password ( uuid )
        let username = nanoid(8) // for the username 
        let unhashed_password = nanoid(8) // for password

        let salt = await bcrypt.genSalt(10)
        let password = await bcrypt.hash(unhashed_password, salt)

        // get the sub sub account and assign it here and also the class ref of the class :)
        let subsubaccount = await SubSubAccountModel.findOne({
            parentID: mongoose.Types.ObjectId(req.params.classId),
            schoolOrOrganizationID: req.school._id
        }).session(session);

        // if there is no any just crash
        if (!subsubaccount) {
            throw new ZoeziBaseError("The subscription object does not exist");
        }

        // we also need to get the classref and update the students thing

        // we have the object, now save the student there and the reverse :)


        // also we need to assign a bunch 
        // AES_ENCRYPTION_KEY
        let student = await StudentModel.create([{
            firstname, lastname, gender: gender.toLowerCase(),
            school: req.school.name, 
            // used for copying the password and someother stuff
            encryptedPassword: CryptoJS.AES.encrypt(unhashed_password, process.env.AES_ENCRYPTION_KEY).toString(),
            username, password, sub_sub_accounts: [ subsubaccount._id ]
        }], { session });

        // add the student to the subscription object
        subsubaccount.students.push(student[0]._id);

        await Promise.all([
            subsubaccount.save(),

            // update the class ref ( the hidden _grade )
            ClassRef.findOneAndUpdate({ _id: req.params.classRefId }, {
                $push: { students: student[0]._id }
            }).session(session)
        ])


        await session.commitTransaction();
        // return the password and the username
        return res.status(201).json({ 
            status: true,
            credentials: { username, password: unhashed_password }
        })
    } catch(error) {
        await session.abortTransaction();
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Unknown Error!"
        })
    } finally {
        session.endSession();
    }
})

router.post("/export/:fromClassRefId/:toClassRefId", async (req, res) => {
    try {
        // do the exporting of the students
        // get the ids of the students to be exported and then export them
        // on exporting the students to another class we need to reset a bunch of stuff though
        // like the pseudoclass

        return res.json({
            status: true,
            message: "You will be worked on"
        })
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Unknown Error!"
        })
    }
})



// a list of students
const list_of_students = yup.array().of(
    yup.object().shape({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        gender: yup.string().required().oneOf([
            "boy", "girl"
        ])
    })
);

// get an xslx file with the students names and push them into the system
// get the school name and the grade id and 
router.post("/import/:classId/:classRefId", [
    multerUploader.single("excelFile"), 
    IsSchoolAuthenticated
],async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let students = await convertToJson(
            req.file.buffer,
            {
                A: "firstname",
                B: "lastname",
                C: "gender"
            },
            list_of_students
        )

        // we have the students now
        // get the 
        // get the sub sub account and assign it here and also the class ref of the class :)
        let subsubaccount = await SubSubAccountModel.findOne({
            parentID: req.params.classId,
            schoolOrOrganizationID: req.school._id
        }).session(session);

        // if there is no any just crash
        if (!subsubaccount) {
            throw new ZoeziBaseError("The subscription object does not exist");
        }

        // we also need to get the classref and update the students thing

        // we have the object, now save the student there and the reverse :)


        // also we need to assign a bunch
        // this is one student ( how about many students )
        let saved_students = await Promise.all(students.map(async ({ firstname, lastname, gender }) => {
            // generate the unique username ( uuid ) and the password ( uuid )
            let username = nanoid(8) // for the username 
            let unhashed_password = nanoid(8) // for password

            // somehow store the passwords
            // we can push the name of the student and the username and the generated password
            // the student can then use them

            let salt = await bcrypt.genSalt(10)
            let password = await bcrypt.hash(unhashed_password, salt)

            let student = await StudentModel.create([{
                firstname, lastname, gender,
                school: req.school.name,
                // allows for the copying of the passwords by the admin for distribution
                encryptedPassword: CryptoJS.AES.encrypt(unhashed_password, process.env.AES_ENCRYPTION_KEY).toString(),
                username, password, sub_sub_accounts: [subsubaccount._id]
            }], { session });

            return student[0];
        }))

        // add the student to the subscription object
        subsubaccount.students.push(...saved_students.map(x => x._id));

        await Promise.all([
            subsubaccount.save(),

            // update the class ref ( the hidden _grade )
            ClassRef.findOneAndUpdate({ _id: req.params.classRefId }, {
                $push: { students: { $each: saved_students.map(x => x._id) } }
            }).session(session)
        ])

        await session.commitTransaction();
        // return the password and the username
        return res.status(201).json({ status: true })
    } catch(error) {
        await session.abortTransaction();
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Unknown Error!"
        })
    } finally {
        session.endSession();
    }
})

module.exports = router