var mongoose = require('mongoose');
var User = require('./user.schema');
var City = require('./city.schema');
var Country = require('./country.schema');
var PropertyType = require('./property-type.schema');

var propertySchema = new mongoose.Schema({  
	propertyType: {
		type: mongoose.Schema.ObjectId,
		ref: 'Property-Type'
	}, //FROM PROPERTY_TYPE TABLE
	// propertyType: String,
	propertyAddress: String,
	agent: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	}, //USER_ID
	postalCode: String,
	city: {
		type: mongoose.Schema.ObjectId,
		ref: 'City'

	}, //ID FROM CITY TABLE
	// city: String,
	state: String,
	country: {
		type: mongoose.Schema.ObjectId,
		ref: 'Country'

	}, //ID FROM COUNTRY TABLE
	// country: String,
	status: String,
	price: Number,
	currency: String,
	rooms: Number,
	area: String,
	buyRent: String,
	garage: Boolean,
	garden: Boolean,
	swimmingPool: Boolean,
	lat: String,
	lon: String,
	additionalInfo: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	verify: Boolean,
	renueval: Boolean,
	uniqueId: {
		type:String,
		require: true,
		// /index: true,
		text: true
	},
	images: [String]
},
{ 
	collection: 'Property' 

});

module.exports =  mongoose.model('Property', propertySchema);  
