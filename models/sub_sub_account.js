const mongoose = require("mongoose");
const moment = require('moment'); // for computing the dates

// this is the one that will be used for managing the subscriptions and a bunch of other stuffs
// linked to one per account

// all data collected will be constrained to this i hope so
// should be linked to a given account
// can be linked to a person or a school in later cases i think

// use many to many relationships

const subsubAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Default" // this is the default account
    },

    // force the guy to enter this ( we cant have more than one default )
    isDefault: {
        type: Boolean,
        default: false
    },

    students: [
        {
            type: mongoose.Types.ObjectId,
            ref: "student"
        }
    ],

    // how do we link the owner
    // to help distinguish between accounts managed by schools or orgnaizations i think
    isManaged: {
        type: Boolean,
        default: false
    },

    // we need this btw
    parentID: {
        type: mongoose.Types.ObjectId,
        ref: "class_unit"
    },

    // the managing school or orgnaization ( i think )
    // will fill this later
    schoolOrOrganizationID: {
        type: mongoose.Types.ObjectId,
        ref: "school"
    },

    subscriptions: [{
        gradeID: {
          type: String,
          required: true
        },
    
        is_special: {
          type: Boolean,
          default: false
        },
    
        // we need to store the subscription type
        subscriptionDays: {
          type: Number,
          default: 1
        },
    
        status: {
          type: Boolean,
          default: false
        },
        waitTime:{
          type: Date,
          default: moment().add(20, 'minutes').toDate(),
          required: false
        },
        paymentStatus:{
          type: String,
          default:"pending"
        },
        reasons:{
          type: String,
          required:false
        },
        gradeName: {
          type: String,
          required: true
        },
        subscription_end: {
          type: Date,
          required: true
        }
      }]
});

module.exports = mongoose.model("sub_sub_account", subsubAccountSchema);