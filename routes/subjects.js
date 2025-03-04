const router = require("express").Router();
const mongoose = require("mongoose");
const { IsSchoolAuthenticated, IsTeacherAuthenticated } = require("../configs");
const { SubjectModel, TeacherModel } = require("../models")

// responsible for creating subjects for the different classes by the class teachers
// ask around to find the flow of things later

// get all the subjects within a given grade
router.get("/:classId", [IsTeacherAuthenticated], async (req, res) => {
    try {
        let subjects = await SubjectModel.find({ grade: mongoose.Types.ObjectId(req.params.classId) })
            .populate('teacher');

        return res.json({ subjects })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: "Unknown Error!" }) 
    }
});

// get data on a single subject
router.get("/information/:subjectId", [IsTeacherAuthenticated], async (req, res) => {
    try {
        // we get the subject and the general teacher of it :)
        let subject = await SubjectModel.findOne({ 
            _id: mongoose.Types.ObjectId(req.params.subjectId) 
        })
            .populate('teacher');

        return res.json({ subject })
    } catch(error) {
        console.log(error);
        return res.status(500).json({ error: "Unknown Error!" }) 
    }
})

// create a subject and then link to the teacher
// this will be created on per school basis
// when we create we also assign the teacher responsible for the subject
router.post("/:classID", [IsSchoolAuthenticated],async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // we are getting an array of this :)
        const { subjects } = req.body;
        const gradeId = mongoose.Types.ObjectId(req.params.classID);

        // get the teacher
        await Promise.all(subjects.map(async ({ teacherId, subject }) => {
            let teacher = await TeacherModel.findOne({ _id: teacherId }).session(session);

            let subject_created = await SubjectModel.create([{
                name: subject,
                grade: gradeId, // verify this before commiting it here
                teacher: teacher._id // this is the teacher responsible for the subject in the grade
            }], { session });

            teacher.subjects.push(subject_created[0]._id)
            await teacher.save();
        }))

        await session.commitTransaction();
        return res.status(201).json({ status: true })
    } catch(error) {
        await session.abortTransaction();

        console.log(error);
        return res.status(500).json({ status: false, error: "Unknown Error!" })
    } finally {
        session.endSession();
    }
})

router.put("/:classID/:subjectId", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // we can only change the assigned teacher 
        const { teacherId } = req.body;

        // we need to find the previous assigned teacher and remove the assigning from them
        let subject = await SubjectModel.findOne({ _id: req.params.subjectId }).session(session);

        // this should be an atomic operation ( if one fails the entire proces should fail )
        await Promise.all([
            // update the teacher model
            TeacherModel.findOneAndUpdate({ _id: subject.teacher }, {
                $pull: { subjects: subject._id }
            }).session(session),
    
            //  update the subjects here
            SubjectModel.findOneAndUpdate({ 
                _id: req.params.subjectId,
                grade: mongoose.Types.ObjectId(req.params.classID)  
            }, { $set: { teacher: teacherId } }).session(session)
        ]);

        await session.commitTransaction();
        return res.status(200).json({ status: true })
    } catch(error) {
        await session.abortTransaction();
        
        console.log(error);
        return res.status(500).json({ error: "Unknown Error!" })
    } finally {
        session.endSession();
    }
})

router.delete("/:classId/:subjectId", [IsSchoolAuthenticated], async (req, res) => {
    // this is also an atomic operation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // get the subject first inoder to get the teacher then remove the subject from them
        // then delete the subject
        const subject = await SubjectModel.findOne({ _id: req.params.subjectId }).session(session);

        await Promise.all([
            // we have the subject
            TeacherModel.findOneAndUpdate({ _id: subject.teacher }, {
                $pull: { subjects: subject._id }
            }).session(session),

            // we now delete the subject
            SubjectModel.deleteOne({ _id: subject._id }).session(session)
        ])

        await session.commitTransaction();

        // successfully removed the grade from the system
        return res.status(200).json({ status: true })
    } catch(error) {
        await session.abortTransaction(); // just incase it fails :)

        console.log(error);
        return res.status(500).json({ error: "Unknown Error!" });

    } finally {
        session.endSession();
    }
})

module.exports = router