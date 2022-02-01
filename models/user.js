const mongoose = require('mongoose')
const moment = require('moment')


// this is underlying layer of the classes ( its just a parent account LMAO )
const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },

  lastname: {
    type: String,
  },

  isSuspended:{
    type: Boolean,
    default:false
  },

  suspension_reasons:{
    type: String,
    required:false
  },

  // if not managed it means its a parent-child account else school-child account
  isManaged: {
    type: Boolean,
    default: false
  },

  // we dont need this here
  mpesaNumber: {
    type: String,
  },
  
  // we wont need this in a auto generated class refs ( pseudousers )
  email: {
    type: String,
    // required: true,
    // unique: true
  },

  // we dont require this one at all
  password: {
    type: String,
    // required: true
  },

  // for other cases e.g the managed accounts, this is useless
  likedBlogArticles:[
    {
      type: String,
      required: true
    }
  ],


  // the students linked to this account
  // for the schools account this is important :)
  students: [{
    type: mongoose.Types.ObjectId,
    ref: "student"
  }],

  isAdmin: {
    type: Boolean,
    default: false
  },

  isMarketer:{
    type: Boolean,
    default: false
  },

  marketerID:{
    type: String,
    required: false
  },

  isReffered:{
    type: Boolean,
    default: false
  },

  referrenceID:{
    type: String,
    required: false
  }
  ,
  triedSample:{
    type:Boolean,
    default:false
  },
  isVerified:{
    type:Boolean,
    default: false
  },
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
  date: {
    type: Date,
    default: Date.now
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
})

const User = mongoose.model('User', UserSchema)

module.exports = User
