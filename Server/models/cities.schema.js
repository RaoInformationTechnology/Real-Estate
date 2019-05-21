var mongoose = require('mongoose');
var Countries = require('./countries.schema');
var Schema = mongoose.Schema;

var citySchema = new mongoose.Schema({  
	country: {
		type: Schema.Types.ObjectId,
		ref: 'Countries'
	},
	name: String,
	latitude: String,
	longitude: String,
	population: String,
	region: String
},
{ 
	collection: 'cities' 
});

module.exports = mongoose.model('cities', citySchema);  
