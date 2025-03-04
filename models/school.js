/*
  This snippet has been generated by johnnesta2018@gmail.com
*/

const mongoose = require("mongoose")

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    // enables for manual reviewing of the account before its handed over
    isApproved: {
        type: Boolean,
        default: false
    },

    theme: {
        type: String,
        default: "#b2dfdb"
    },

    logo: {
        type: String
    },

    // make this geolocation data later
    location: {
        type: String,
        required: true
    },

    // we can use this later when we start offering website hosting stuff
    // the main school email
    email: {
        type: String,
        required: true,
        unique: true
    },

    mpesaNumber: {
        type: String,
        required: true,
        unique: true
    },

    registrationNumber: {
        type: String,
        unique: true,
        required: true // required for account creation stuff
    },

    // // the password 
    password: {
        type: String,
        required: true
    },

    // a list of all the classes in the school
    // we can use id directly in the grades object
    // grades: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: "class_unit"
    // }],

    // a list of the teachers in the school
    // how the fuck do we make the teacher the main guy in the relationship
    // use the schoolID rel in the teacher object
    // teachers:[{
    //     type: mongoose.Types.ObjectId,
    //     ref: "teacher"
    // }]
})

module.exports = mongoose.model("school",schoolSchema)