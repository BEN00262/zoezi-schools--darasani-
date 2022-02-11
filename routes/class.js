const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const humanTime = require("human-time");
const { IsSchoolAuthenticated, IsTeacherAuthenticated } = require("../configs");
const router = require("express").Router();
const { 
    ClassModel, SchoolModel, 
    ClassRef, UserDataModel, 
    specialPaperHistoryModel, SubSubAccountModel, TeacherModel 
} = require("../models");


// managing the classes within the school
router.get("/all", [IsSchoolAuthenticated],async (req, res) => {
    // return the classes within the school ID
    try {
        // we also need to check
        // weve designed for a single year ( what if we have multiple years )
        // group them then get the one with the latest year and it has not be suspended
        // will work this out later
        let grades = await ClassModel.find({ schoolID: req.school._id.toString(), isClosed: false })
            .populate("classTeacher")
            .populate("classRef");

        return res.status(200).json({ school: req.school.name, grades })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false })
    }
})

router.get("/subscriptions/:classId", [IsSchoolAuthenticated],async (req, res) => {
    try {

        let subscriptions = await SubSubAccountModel.aggregate([
            {
                $match: { 
                    parentID: mongoose.Types.ObjectId(req.params.classId),
                    schoolOrOrganizationID: req.school._id,
                }
            },
            { $project: { subscriptions: 1 } },
            { $unwind: "$subscriptions" },
            { $match: { paymentStatus: { $ne: 'pending' } } },
            // we dont need to group anymore
            // {
            //     $group: {
            //         _id: "$gradeName",
            //         subscription: { $push: '$$CURRENT' }
            //     }
            // }
        ]);

        subscriptions = subscriptions.map(x => {
            let isExpired = x.subscription_end < new Date();

            return ({
                gradeName,
                isExpired,
                date: subscription_end,
                daysRemaining: humanTime(subscription_end)
            })
        })

        // get the subscription stuff from here
        return res.json({ subscriptions })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false })
    }
})


// gets one class data
router.get("/:classID", [IsTeacherAuthenticated], async (req, res) => {
    try { 
        // we need to populate some other stuff too
        let grade = await ClassModel.findOne({ _id: req.params.classID })
            .populate("classTeacher");

        if (!grade) {
            throw new Error("Grade not found");
        }

        // we wont fetch any data here ( we will fetch them from other routes :) ) --> reduces the strain on this one
        return res.status(200).json({ grade })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false })
    }
})

router.get("/learners/credentials/:classRefId", [
    // the school admin download
    IsTeacherAuthenticated,
], async (req, res) => {
    try {
        // get all the student credentials and return a downloadable file of credentials
        let _classRef = await ClassRef.findOne({ _id: req.params.classRefId }).populate("students");

        // export the credentials as an excel file
        let students = _classRef ? _classRef.students.map(x => ({
            firstname: x.firstname,
            lastname: x.lastname,
            username: x.username,

            // convert the passwords to readable strings :)
            password: CryptoJS.AES.decrypt(
                x.encryptedPassword, process.env.AES_ENCRYPTION_KEY
            ).toString(CryptoJS.enc.Utf8),
        })) : [];

        return res.json(students);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false });   
    }
})

router.get("/learners/:classRefId", [IsTeacherAuthenticated],async (req, res) => {
    try {
        let _classRef = await ClassRef.findOne({ _id: req.params.classRefId }).populate("students");
        return res.json({ learners: _classRef ? _classRef.students : [] });

    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false })
    }
})

class ZoeziBaseError extends Error {
    constructor(message) {
        super(message)
    }
}

router.post("/", [IsSchoolAuthenticated],async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        // get the name of the grade, the year of the grade, the stream, and the class teacher id
        const { grade, year, stream, teacherId } = req.body;

        // if the class already exists in this school i guess we just update it
        let exisitingGrade = await ClassModel.findOne({ name: grade, year: +year, stream }).session(session);
        if (exisitingGrade) {
            throw new ZoeziBaseError("Grade already exists. You can only update it")
        }

        let classRef = await ClassRef.create([{ isManaged: true }], { session })

        let newGrade = await ClassModel.create([{ 
            name: grade, year, stream, classTeacher: teacherId,
            classRef: classRef[0]._id, schoolID: req.school._id.toString()
        }], { session });

        // also assign the classTeacher the class buana

        await Promise.all([
            SubSubAccountModel.create([{ 
                isDefault: true, isManaged: true, 
                parentID: newGrade[0]._id, schoolOrOrganizationID: req.school._id
            }], { session }),

            // the classTeacher
            TeacherModel.findOneAndUpdate({ _id: teacherId }, {
                $push: { grades: newGrade[0]._id }
            }).session(session)
        ])

        await session.commitTransaction();
        return res.status(201).json({ status: true })
    } catch(error) {
        await session.abortTransaction();
        // creating a grade 
        console.log(error)
        return res.status(500).json({ 
            status: false, 
            message: error instanceof ZoeziBaseError ? error.message : "Unknown Error!" 
        })
    } finally {
        session.endSession();
    }
})

// we only allow only updating the class teachers only 
router.put("/:classId", [IsSchoolAuthenticated], async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // edit the year, stream, and maybe the classTeacher
        const { classTeacherId } = req.body;

        // change the stuff in two places the teachers
        // start the migrations
        let grade = await ClassModel.findOne({ _id: req.params.classId }).session(session);
        if (!grade) {
            throw new ZoeziBaseError("Grade does not exist")
        }

        let previousClassTeacher = grade.classTeacher;
        // classTeacher
        grade.classTeacher = mongoose.Types.ObjectId(classTeacherId);

        // update the two objects and we are done
        await Promise.all([
            grade.save(),

            TeacherModel.findOneAndUpdate({ _id: previousClassTeacher }, {
                $pull: { grades: grade._id }
            }).session(session),

            TeacherModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(classTeacherId) }, {
                $push: { grades: grade._id }
            }).session(session)
        ]);

        await session.commitTransaction();
        return res.json({ status: true });

    } catch(error) {
        await session.abortTransaction();

        console.log(error);
        return res.status(500).json({ status: true })
    } finally {
        session.endSession();
    }
})

// we should also be able to get the analytics on per teacher basis ( i think )

module.exports = router