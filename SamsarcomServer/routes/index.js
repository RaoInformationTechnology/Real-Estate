var express = require('express');
var router = express.Router();
var country = require("../models/country.schema");
var city = require("../models/city.schema");
const download = require('image-downloader');
var async = require('async');
var uuid = require('node-uuid');

router.get('/countries', function(req, res) {
	console.log("Country = ",country);
	country.find().exec(function(err,countries){
		console.log("ERROR : ",err);
		console.log("Result : ",countries);
		res.send({countries});
	})
});

router.post('/image-upload-url',function(req,res){
	console.log("IMAGES : ",req.body.images);
	var imagesToUpload = JSON.parse(req.body.images);
	var uploadedImagesForResponse = [];
	async.each(imagesToUpload, function(singleImage, callback) {

		console.log('Processing singleImage ' + singleImage);
		download.image({
			url: singleImage,
			dest: './uploads/testuploads/'+uuid.v4()+'.jpg'
		})
		.then(({ filename, image }) => {
			console.log('File saved to', filename);
			uploadedImagesForResponse.push(filename);
			callback();
		}).catch((err) => {
			callback(err)
		});

	}, function(err) {
		if( err ) {
			console.log('A file failed to process');
			return res.send({
				status: "Error",
				msg: err
			})
		} else {
			console.log('All files have been processed successfully');
			return res.send({
				status: "Done",
				msg: uploadedImagesForResponse
			})
		}
	});

	// res.send({data:req.body})
});

router.post('/countries', function(req, res) {
	console.log("Country to create = ",req.body.name);
	country.create({
		name: req.body.name
	},function(err,country_res){
		if(err){
			console.error("ERROR ",err);
			return res.status(500).send("ERROR",err);
		}
		console.log("CREATED: ",country_res);
		return res.send({country_res});
	});
});



router.post('/cities',function(req,res){
	// country.findById(req.body.countryId).exec(function(err,countries){
	// 	res.send({countries})
	// })

	city.create({
		name: req.body.name,
		countryId: req.body.countryId
	},function(err,newcity){
		res.send({
			msg: 'CITY CREATED',
			newcity
		})
	});


	// country.create({
	// 	name: req.body.countryName
	// },function(err,newCountry){
	// 	city.create({
	// 		name: req.body.cityName,
	// 		countryId: newCountry._id
	// 	},function(err,cities){
	// 		res.send({cities,newCountry})
	// 	});

	// })
})



router.get('/cities',function(req,res){
	city.find()
	.populate('countryId')
	.exec(function(err,cities){
		console.log(cities);
		res.send({cities})
	});
})

router.get('/cities-by-country/:id',function(req,res){
	console.log("Country ID ",req.params.id);
	city.find()
	.exec(function(err,cities){
		console.log(cities);
		res.send({cities})
	});
})



router.get('/cities/:id',function(req,res){
	res.send("CITIES OF COUNTRY : "+req.params.id)
})

module.exports = router;
