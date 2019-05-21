var mongoose = require('mongoose');
var Country = require('./country.schema');
var Schema = mongoose.Schema;

var citySchema = new mongoose.Schema({  
	country: {
		type: Schema.Types.ObjectId,
		ref: 'Country'
	},
	name: String,
	latitude: String,
	longitude: String,
	population: String,
	region: String
},
{ 
	collection: 'City' 
});

module.exports = mongoose.model('City', citySchema);  
