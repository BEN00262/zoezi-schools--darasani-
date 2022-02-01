/*
  This snippet has been generated by johnnesta2018@gmail.com
*/

const mongoose = require("mongoose")

// we should be able to pull data on this subject for the whole student population
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    // should be linked with a certain class
    grade: {
        type: mongoose.Types.ObjectId,
        ref: "class_unit"
    },

    // info of the teacher taking the subject
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: "teacher"
    }
})

module.exports = mongoose.model("class_subjects",subjectSchema)