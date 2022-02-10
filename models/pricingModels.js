const mongoose = require("mongoose");


const pricingSchema = new mongoose.Schema({
	price:{
		type: Number,
		required: true,
	},
	isDarasani: {
		type: Boolean,
		default: false
	},
	days:{
		type: Number,
		required: true
	},
	pricingType:{
		type: String,
		required: true
	},
	defaultPrice:{
		type: Boolean,
		default: false
	},
	// what we offer for the plan
	features: [{
		type: String,
		required: true
	}]
});

module.exports = mongoose.model('pricing',pricingSchema);
