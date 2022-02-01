const mongoose = require("mongoose");

// have sub accounts that will have the link to everything in zoezi now
const childSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    // not required but for managed accounts it is
    // this is required from this side of the divide :)
    password: {
        type: String,
        required: true
    },

    // used for copying the passwords by the admins
    encryptedPassword: {
        type: String,
        required: true
    },

    hasTriedSample: {
        type: Boolean,
        default: false
    },

    // a link to the parent
    parentID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },

    lastname: {
        type: String,
        required: true
    },

    // we dont really need it ( but its recommended )
    profilePic: {
        type: String,
    },

    // each child has their own preferences
    preferences: {
        numberOfQuestions: {
          type: Number,
          default: 5
        },
        blogNotification: {
          type: Boolean,
          default: false
        },
        nightMode: {
          type: Boolean,
          default: false
        }
    },

    // used for searching the school the kid is in ( and also for tracking the data )
    school: {
        type: String,
        required: true
    },

    username: {
        type: String,
        unique: true
    },

    gender: {
        type: String,
        enum: ["boy", "girl"],
        default: "boy"
    },

    // attach a bunch of stuff later
    // if they havent interacted with the system we will know
    lastActive: {
        type: Date,
    },

    sub_sub_accounts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "sub_sub_account"
        }
    ]
});

module.exports = mongoose.model("student", childSchema);