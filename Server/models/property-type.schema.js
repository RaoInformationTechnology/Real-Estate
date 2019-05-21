var mongoose = require('mongoose');

var propertyTypeSchema = new mongoose.Schema({  
	description: String,
	language: String,
	name: String
},
{ 
	collection: 'Property-Type' 
});

module.exports = mongoose.model('Property-Type', propertyTypeSchema);  
