const mongoose = require('mongoose');
var city = require('../models/city.schema');
var cities = require('../models/cities.schema');
let cityController = {

	getCities: function(req,res){
		city
		.find()
		.sort('name')
		.populate({
			path: 'country',
			select: "name"
		})
		.exec(function(err,cities){
			if(err){
				console.error(err)
				return res.send({
					err: "ERROR!",
					msg: err
				});
			}
			else{
				return res.status(200).send(cities);
			}
		})
	},


	getCityDetials: function(req,res,next){
		// console.log()
		city.find({'name': req.params.name} )
		.select('_id region country name')
		.then(doc => {
			console.log("City",doc.country);
			if (doc.length > 0) {
				if (doc.country == undefined ) {
					return res.status(202).send(doc);
				}
				else{
					return res.status(200).send(doc);

				}

			}else{
				return res.status(201).send("No Valid City Found");
			}
		})
		.catch(err => console.log(err));
	},

	createCity: function(req,res,next){
		const City = new city({
			_id: mongoose.Types.ObjectId(),
			country: req.body.country,
			name: req.body.name,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			population: req.body.population,
			region: req.body.region
		});

		City.save().then(result => {
			res.status(200).json(result);
		})
		.catch(err => console.log(err));

	},


	updateCity: function(req,res,next){
		city.findByIdAndUpdate(req.body._id,req.body,function(err,city){
			if(err){
				console.error(err);
				return res.status(500).send("ERROR UPDATING City")
			}
			return res.status(200).send(city);
		});

	},

	getCitiesByCountryId: function(req,res){
		var country = req.body.country;
		city
		.find({'country': country})
		.sort('name')
		.populate({
			path: 'country',
			select: "name"
		})
		.exec(function(err,cities){
			if(err){
				console.error(err)
				return res.send({
					err: "ERROR!",
					msg: err
				});
			}
			else{
				console.log("cities=================>",cities.length);
				return res.status(200).send(cities);
			}
		})
	},

	getWorldCitiesByCountryId: function(req,res){
		var country = req.body.country;
		console.log(country);
		cities
		.find({'country': country})
		.sort('name')
		// .populate({
		// 	path: 'country',
		// 	select: "name"
		// })
		.exec(function(err,cities){
			if(err){
				console.error(err)
				return res.send({
					err: "ERROR!",
					msg: err
				});
			}
			else{
				console.log(cities.length);
				return res.status(200).send(cities);
			}
		})
	},

	getWorldCityDetials: function(req,res,next){
		// console.log()
		cities
		.find({'name': req.params.name} )
		.select('_id region country name')
		.then(doc => {
			console.log("City",doc.country);
			if (doc.length > 0) {
				if (doc.country == undefined ) {
					return res.status(202).send(doc);
				}
				else{
					return res.status(200).send(doc);

				}

			}else{
				return res.status(201).send("No Valid City Found");
			}
		})
		.catch(err => console.log(err));
	},

	createWorldCity: function(req,res,next){
		const City = new cities({
			_id: mongoose.Types.ObjectId(),
			country: req.body.country,
			name: req.body.name,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			population: req.body.population,
			region: req.body.region
		});

		City.save().then(result => {
			res.status(200).json(result);
		})
		.catch(err => console.log(err));

	},


	updateWorldCity: function(req,res,next){
		cities.findByIdAndUpdate(req.body._id,req.body,function(err,city){
			if(err){
				console.error(err);
				return res.status(500).send("ERROR UPDATING City")
			}
			return res.status(200).send(city);
		});

	},
};

module.exports = cityController;