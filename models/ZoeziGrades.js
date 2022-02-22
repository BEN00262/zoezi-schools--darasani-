const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
let objectID = mongoose.Schema.Types.ObjectId;

let QuesSchema = new Schema({
	question:{
		type:String,
		required:true
	},
        options:{
	  	type:String,
		required:false
	},
	answer:{
		type:String
	},
	additionalInfo:{
		type:String
	},
	grade:{
		type:String,
		required:true
	},
	subject:{
		type:String,
		required:true
	},
	isExperimental:{
        	type: Boolean,
        	default: false
    	},
	isSample:{
		type:Boolean,
		default:false
	},
	subjectID:{type:objectID,ref:"subject"},
	questionTag:[{Tag:{type:String,default:"notag"}}]
});

let subjectSchema = new Schema({
	subject:{
		type:String,
		required:true
	},
	isVisible: {
		type: Boolean,
		default: true
	},
	questions:[{type:objectID,ref:'ques'}],
	grade:{type:objectID,ref:'grades'}
})

const GradeSchema = new Schema({
	grade:{
		type:String,
		required:true
	},
	available:{
		type: Boolean,
		default: false
	},
	gradeNumeric:{
		type:Number,
		enum:[1,2,3,4,5,6,7,8],
		default:9,
		required:false
	},
	subjects:[{type:objectID,ref:'subject'}]
})

// used for the markets page and a whole other things
module.exports = {
	ZoeziGradesModel: mongoose.model('grades',GradeSchema),
	ZoeziSubjectsModel: mongoose.model('subject',subjectSchema),
	ZoeziQuestionModel: mongoose.model('ques', QuesSchema)
}