const mongoose = require('mongoose');
var propertyType = require('../models/property-type.schema');
// var jwt = require('jsonwebtoken');

let propertyTypeController = {

	getPropertyTypes: function(req,res){
		console.log("-------------------- SESSION INFO --------------------");
		console.log(req.session.user);
		console.log("-------------------- SESSION INFO ENDS --------------------");

		propertyType.find().exec(function(err,propertyTypes){
			if(err){
				console.error(err);
				return res.send("ERROR GETTING PROPERTY TYPES")
			}
			return res.send(propertyTypes);
		})
	},

	getPropertyType: function(req,res){
		console.log("GETTING USER FOR ID : ",req.params.id);
		propertyType.findById(req.params.id).exec(function(err,propertyType){
			if(err){
				console.error(err);
				return res.send("ERROR GETTING PROPERTY TYPE")
			}
			return res.send(propertyType);
		})

	},

	updatePropertyType: function(req,res){
		propertyType.findByIdAndUpdate(req.body._id,req.body,function(err,propertyType){
			if(err){
				console.error(err);
				return res.send("ERROR UPDATING PROPERTY TYPE")
			}
			return res.send(propertyType);
		});
	},

	createPropertyType: function(req,res,next){
		const PropertyType = new propertyType({
			_id: mongoose.Types.ObjectId(),
			description: req.body.description,
			language: req.body.language,
			name: req.body.name
		});

		PropertyType.save().then(result => {
			res.status(200).json(result);
		})
		.catch(err => console.log(err));

	},

};

module.exports = propertyTypeController;