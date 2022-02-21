const mongoose = require('mongoose');

// candidate for migration ( i think )
const libPaperSchema = new mongoose.Schema({
    userID: {
        type: String,
        ref: 'user'
    },

    studentID: {
        type: String,
        required: true
    },

    subsubAccountID: {
        type: String,
        required: true
    },

    when: {
        type: Date,
        default: Date.now
    },

    // grade name
    grade: {
        type: String,
        required: true
    },

    // subject name
    subject: {
        type: String,
        required: true
    },

    // participants participation data
    content: [{

        // used in the rendering of the question in the frontend portion
        questionType: {
            type: String,
            enum: ["normal", "oldversion", "comprehension"],
            default: "normal"
        },

        // actual content of the question
        content: {
            // for old version and normal questions
            status: {
                type: Boolean,
                default: false
            },

            // a reference to the actual question
            question: {
                type: mongoose.Types.ObjectId,
                ref: 'ques',
                required: true
            },

            // old version question
            attempted_option: {
                type: String
            },

            // normal question 
            attempted_options: [{
                optionID: {
                    type: String,
                    required: true
                },
            }],

            children: [{
                status: {
                    type: Boolean,
                    required: true
                },

                // an id to the sub question but wont be resolved 
                question: {
                    type: String,
                    required: true
                },

                // the options attempted for the sub questions
                attempted_options: [{
                    optionID: {
                        type: String,
                        required: true
                    },
                }],
            }]
        },
    }],
    score: {
        passed: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('libPaper', libPaperSchema)