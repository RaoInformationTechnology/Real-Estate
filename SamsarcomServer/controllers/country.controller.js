const mongoose = require('mongoose');
var country = require('../models/country.schema');
var countries = require('../models/countries.schema');
let countryController = {

	getCountries: function(req,res){
		country
		.find()
		.exec(function(err,counties){
			if(err){
				console.error(err)
				return res.status(500).send({
					err: "ERROR!",
					msg: err
				});
			}
			else{
				return res.status(200).send(counties);
			}
		})
	},

	getWorldCountries: function(req,res){
		countries
		.find()
		.sort('name')
		.exec(function(err,counties){
			if(err){
				console.error(err)
				return res.status(500).send({
					err: "ERROR!",
					msg: err
				});
			}
			else{
				console.log("countriewssssssssssss response",counties);
				return res.status(200).send(counties);
			}
		})
	},

	getCitiesByCountryId: function(req,res){
		var country = req.body.country;
		console.log("Country select", country);
		country
		.find({'country': country})
		.exec(function(err,cities){
			if(err){
				console.error(err)
				return res.send({
					err: "ERROR!",
					msg: err
				});
			}
			else{
				console.log("Cities",cities);
			}
		})
	},
};

module.exports = countryController;