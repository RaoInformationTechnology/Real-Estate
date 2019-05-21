var mongoose = require('mongoose');

var countrySchema = new mongoose.Schema({  
	name: String
},
{ 
	collection: 'countries' 
});

module.exports =  mongoose.model('countries', countrySchema);  
