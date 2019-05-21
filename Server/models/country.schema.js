var mongoose = require('mongoose');

var countrySchema = new mongoose.Schema({  
	name: String
},
{ 
	collection: 'Country' 
});

module.exports =  mongoose.model('Country', countrySchema);  
