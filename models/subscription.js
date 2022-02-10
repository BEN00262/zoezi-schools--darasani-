const mongoose = require("mongoose");


const subscriptionSchema = new mongoose.Schema({
    // the link to the school :)
    schoolID: {
        type: mongoose.Types.ObjectId,
        ref: "school"
    },

    // the subscription object
    price: {
        type: Number,
        required: true
    },

    // should we just store the name ( i think :) )
    subscriptionItem: {
        type: String,
        required: true
    },

    // these are the linked grades
    grades: [
        {
            name: {
                type: String,
                required: true
            },

            students: {
                type: Number,
                required: true
            }
        }
    ],

    transactionId: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        default: "pending",
        enum: ["pending", "success", "failed"]
    },

    // this is the message that comes from AT
    message: {
        type: String,
    },

    // this is unecessary but we will just place it here
    total: {
        type: Number,
        required: true
    },

    subscriptionType: {
        type: String,
        required: true
    },

    subscriptionEnd: {
        type: Date,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model("transaction", subscriptionSchema);