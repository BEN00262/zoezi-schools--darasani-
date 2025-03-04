const mongoose = require("mongoose");
const { IsSchoolAuthenticated } = require("../configs");
const { ZoeziGradesModel, SubjectModel } = require("../models");
const { subjectFind } = require("../utils");

const router = require("express").Router();


// fetch the grades and display them
router.get("/grades", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let grades = await ZoeziGradesModel.aggregate([
            { $match: { available: true } },
            { $sort: { gradeNumeric: 1 } },
            { $project: { grade: 1 } }
        ])

        return res.json({ status: true, grades: [
            ...(grades || []).map(x => x.grade),
            "eight"
        ] })
    }catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Internal server error!"})
    }
})

// filter out subjects already chosen :)
router.get("/subjects/:gradeName/:classId", [IsSchoolAuthenticated], async(req, res) => {
    try {
        let class_subjects = await SubjectModel.aggregate([
            { $match: { grade: mongoose.Types.ObjectId(req.params.classId) } },
            { $project: { name: 1 } }
        ]);

        if (req.params.gradeName === "eight") {
            return res.json({ 
                status: true, 
                subjects: subjectFind(req.params.gradeName).filter(
                    x => !(class_subjects.findIndex(y => y.name === x) > -1)
                )
            })
        }

        let grade = await ZoeziGradesModel.findOne({ 
            grade: req.params.gradeName 
        }).populate("subjects");

        return res.json({ 
            status: true, 
            subjects: (grade ? grade.subjects.map(x => x.subject) : []).filter(
                x => !(class_subjects.findIndex(y => y.name === x) > -1)
            ) 
        })
    }catch(error) {
        console.log(error);
        return res.status(500).json({ status: false, error: "Internal server error!"})
    }
})

module.exports = router;