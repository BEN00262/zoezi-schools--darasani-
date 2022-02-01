const mongoose = require('mongoose');


const userInteractionSchema = new mongoose.Schema({
	subjectName:{
		type:String,
		required:true
	},

	// add another field for monitoring the subscription object ( for those that dont have we default to this )
	userID:{
		type:String,
		required:true
	},

	// scope on these two also
	studentID: {
        type: String,
        required: true
    },

    subsubAccountID: {
        type: String,
        required: true
    },


	gradeName:{
		type:String,
		required:true 
	},
	subjectID:{
		type:String,
		required:true
	},
	hits: {
		type: Number,
		default: 0,
	},
	ups:{
		type:Number,
		required:true
	},
	downs:{
		type:Number,
		required:true
	},
	totalQuestionsAttempted:{
		type:Number,
		required:true
	},
	dateCollected:{
		type:Date
	}
});


module.exports = mongoose.model('userData',userInteractionSchema)
