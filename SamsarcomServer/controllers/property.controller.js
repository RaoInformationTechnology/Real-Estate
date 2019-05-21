const mongoose = require('mongoose');
var property = require('../models/property.schema');
var csv = require('csvtojson');
var ObjectId = require('mongodb').ObjectId; 
const fs = require("fs");
var async = require('async');
var XLSX = require('xlsx');
const download = require('image-downloader');
var uuid = require('node-uuid');
var country = require('./country.controller');
var City = require('../models/city.schema');
var PropertyType = require('../models/property-type.schema');
var User = require('../models/user.schema');
var mailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');


let propertyController = {

	massUpload: function(req,res){
		console.log("req", req.body);
		var sampleFile = req.files.uploadedCsv;
		var fullFileArray = [];

		// UPLOAD FILE INTO ./uploads/csvs/ FOLDER.
		sampleFile.mv('./uploads/csvs/'+sampleFile.name, function(err) {
			if (err) return res.status(500).send(err);
			console.log("FILE UPLOADED. Now Moving ahead.")
			afterFileUpload(sampleFile);
		});


		function afterFileUpload(sampleFile){
			console.log("In the Switch Case for type = ", sampleFile.mimetype);
			switch(sampleFile.mimetype){
				case 'text/csv':  
				doCsvParsing('./uploads/csvs/'+sampleFile.name)
				break;
				case 'application/vnd.ms-excel':
				case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				doExcelParsing('./uploads/csvs/'+sampleFile.name);
				break;
				default: console.log("NO VALID EXTENSION")
			}
		}
		function doExcelParsing(fileLocation){
			console.log("IN the function for excel at path: ",fileLocation);
			var workbook = XLSX.readFile(fileLocation);
			var sheet_name_list = workbook.SheetNames;
			addDocsToDB(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]),function(){
				res.send("Successfully uploaded and added to Database !");
			});
		}
		

		function doCsvParsing(fileLocation){
			console.log("DOING CSV PARSING STUFF");
			csv()
			.fromStream(fs.createReadStream(fileLocation))
			.on('json',(jsonObj)=>{
				// console.log("Single Object",jsonObj);
				fullFileArray.push(jsonObj);
			})
			.on('done',(error)=>{
				console.log("DONE adding csv rows to JSON ARRAY !!!");
				addDocsToDB(fullFileArray,function(){
					res.send("Successfully uploaded and added to Database !");
				});
			})

		}

		

		function getPropertyTypeId(propertyType,callback){
			// console.log("Find Property Type Id",propertyType);
			PropertyType.find({'name': propertyType} )
			.select('_id')
			.then(doc => {
				if (doc.length > 0) {
					return callback(doc[0]._id);

				}else{
					return callback("Invalid Property Type!");
				}
			})
			.catch(err => console.log(err));
		}

		function getCityDetials(cityName,callback){
			// console.log("Find City Details Id",cityName);
			City.find({'name': cityName} )
			.select('_id region country')
			.then(doc => {
				if (doc.length > 0) {
					return callback(doc[0]);

				}else{
					return callback("City Not Found");
				}
			})
			.catch(err => console.log(err));
		}

		function getMaxId(countryId,callback){
			var maxUniqeId = 0;
			// console.log("COUNTRY", countryId);
			property.find( { 'country': countryId } ).sort({"_id" : -1}).limit(1)
			.then(doc=>{
				if (doc.length == 1) 
				{
					maxUniqeId = doc[0].uniqueId;
					var length = maxUniqeId.length;
					var trimmedString = maxUniqeId.substring(8, length);
					number = parseInt(trimmedString)+1;		
					var lastYear = maxUniqeId.substring(3, 7);				
					if (countryId == '5ab1fc262c1c50037e87adf9' && doc[0].country == '5ab1fc262c1c50037e87adf9') {
						var text = "MA";
					}
					else if (countryId == '5ab1fc482c1c50037e87adfd' && doc[0].country == '5ab1fc482c1c50037e87adfd'){
						var text = "TR";
					}
					var dt = new Date();
					var year = dt.getFullYear();
					var unique = '';

					if (year == lastYear) {
						// console.log("lastYear", lastYear);
						unique = text+"-"+year+"-"+number;
						return callback(unique);
					}else
					{
						unique = text+"-"+year+"-1";
						return callback(unique);
					}

				}
				else{

				}
			}).catch(err => {
				console.log(err)
				res.status(500).json({
					msg: err
				});
			});
		}


		function getAgentId(agentname,callback){
			if (agentname == undefined) {
				return callback("Invalid Agent Name");

			}
			console.log("agentname",agentname);
			var firstName = agentname.split(' ').slice(0,-1);
			var lastName = agentname.split(' ').slice(-1).join('');
			User.find({'firstName': firstName, 'lastName': lastName}).select('_id').exec()
			.then(doc => {
				// console.log(doc.length);
				if (doc.length > 0) {
					return callback(doc[0]._id);

				}else{
					return callback("Invalid Agent Name");
				}
			})
			.catch(err => console.log(err));
		}


			// TO ADD FILES TO DB. 
			/*
			It Requires the full array of all the rows in json format which are read from the file : csv/excel.
			*/
			function addDocsToDB(fullFileArray,AddDocsFinishCB){
				// console.log("ADDING DOCS TO DB");
				// console.log("Full ARRAY", fullFileArray)
				let counter = 0;
				let addCounter = 0;
				let errorResult = [];
				// AECB Stands for AsynchEachCallBack
				async.eachOfSeries(fullFileArray, function (item, key,AECB) {
					counter++;
					console.log("ADDING : "+counter);
					console.log("Single",item);
					// console.log("Key",key);
					

					getAgentId(item.agent,function(agentId){
						
						item.agent = agentId;
						
					});
					if (item.garden == undefined) {
						item.garden = false;
					}else{
						item.garden = (item.garden.toLowerCase() == 'true');
					}

					if( item.garage == undefined) {
						item.garage = false;
					}
					else{
						item.garage = (item.garage.toLowerCase() == 'true');
					}
					if (item.swimmingPool == undefined) {
						item.swimmingPool = false;
					}
					else{
						item.swimmingPool = (item.swimmingPool.toLowerCase() == 'true');
					}

					var imagesToUpload = [];
					
					if(item.image1 != undefined)  {
						imagesToUpload.push(item.image1);
						delete item.image1;
					}

					if (item.image2 != undefined ) {
						imagesToUpload.push(item.image2);
						delete item.image2;
					}

					if (item.images3 != undefined) {
						imagesToUpload.push(item.images3);
						delete item.image3;
					}				

					getPropertyTypeId(item.propertyType, function(propertyType){
						
						item.propertyType = propertyType;
					});
					getCityDetials(item.city, function(city){
						if (city == "No Valid City Found") {
							item.city = city;
						}else{
							item.city = city._id;
							item.country = city.country;
							item.state = city.region;
							getMaxId(item.country, function(uniqueId){
								// console.log("Max Id :",item.uniqueId);
								item.uniqueId = uniqueId;
							});							
						}
					});


					var uploadedImagesForResponse = [];
					async.eachOfSeries(imagesToUpload, function(singleImage, key, callback) {

						download.image({
							url: singleImage,
							dest: './uploads/testuploads/'+uuid.v4()+'.jpg',
							timeout: 0,
						})
						.then(({ filename, image }) => {
							uploadedImagesForResponse.push(filename);
							callback(null,filename);
						}).catch((err) => {
							callback(err)
						});

					}, function(err) {
						if( err ) {
							console.log(err);
							AECB(err);
						} else {
							if(item.propertyType != "Invalid Property Type!") {
								if(item.agent != "Invalid Agent Name"){
									if(item.city != "No Valid City Found"){

										item.images = uploadedImagesForResponse;
										item.verify = false;
										item.renueval = false;
										// console.log("Item For Database Entry",item);
										property.create(item,function(err,doc){
											if(err){
												console.error(err);
												return AECB(err);
											}
											addCounter++;
											console.log(addCounter + " items added !")								
											AECB(null);
											
										});								
									}else{
										var errorLine = {};
										addCounter++;
										errorLine['Line '+ addCounter] = item.city;
										errorResult.push(errorLine);
										AECB(null);
									}

								}
								else{
									var errorLine = {};
									addCounter++;
									errorLine['Line '+ addCounter] = item.agent;
									errorResult.push(errorLine);
									AECB(null);

								}
							}
							else{
								var errorLine = {};
								addCounter++;
								errorLine['Line '+ addCounter] = item.propertyType;
								errorResult.push(errorLine);
								AECB(null);

							}

					// console.log("Item For Database Entry",item);
				}
			});

				}, function (error) {
					if (error){
						console.log(error);
					// res.json(500,{error: error});
				} 
				var output = '<!DOCTYPE html><html><head><style>table {border-collapse: collapse;width: 100%;}th, td {text-align: left;padding: 8px;}tr:nth-child(even){background-color: #f2f2f2}</style></head><body><h2>samsarcom.be Error in upload file</h2><div style="overflow-x:auto;"><table>';
				var errorList =  "";

				for (var i = 0; i < errorResult.length ; i++) {
					errorList = errorList+'<tr><td>'+ JSON.stringify(errorResult[i])+'</td></tr>';
					console.log("error list",errorList);
					
				}

				output = output + errorList;
				// output = output + req.body.phone + '</td></tr>;
				output = output + '</table></div></body></html>';

				console.log("output",output);

				var aws = { key: 'AKIAIH7WL3IYEOGOCR3Q', secret: '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', amazon: 'eu-west-1' };

				var transporter = mailer.createTransport(ses({
					accessKeyId: aws.key,
					secretAccessKey: aws.secret,
					region: aws.amazon
				}));

				transporter.sendMail({
					from: 'info@samsarcom.be',
					to: 'info@samsarcom.be',
					bcc: 'shukla.yash@yahoo.com',
					subject: 'Error! Information is Invalid',
					html: output
			// attachments: attachments ? attachments : null
		}, function (err, result) {
			if (!err) {
				console.log("Result", result);
				return res.status(200).send(result);
			}
			else{

				console.log("Error in mail",err);
				return res.status(500).send(err);
			}
		})
			});
}
},


testUpload: function(req,res)
{
	if (req.files.foo.length == undefined) {

		var sampleFile = req.files.foo;
		console.log("Single FILE UPLOAD TEST : req.files = ",sampleFile);

		sampleFile.mv('./uploads/testuploads/'+sampleFile.name, function(err,result) {
			if (err)
				return res.status(500).send(err);
		});

	}else{

		for(var i = 0; i < req.files.foo.length; i++){
			console.log("sampleFile", req.files.foo[i]);				
			var sampleFile = req.files.foo[i];

			sampleFile.mv('./uploads/testuploads/'+sampleFile.name, function(err) {
				if (err)
					return res.status(500).send(err);
			});
		}
	}
	return res.send('File uploaded!');
},

getProperties: function(req,res){
	property
	.find()
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region -_id"
	})
	.exec(function(err,properties){
		if(err){
			console.error(err)
			return res.send({
				err: "ERROR!",
				msg: err
			});
		}
		else{
			console.log("ger properties details for coustmore",properties);
			return res.send(properties);
		}
	})
},

getUnverifiedProperties: function(req,res){
	var perPage = 15;
	const page = req.params.page;
	const sortType = req.params.sortType;

	console.log("Sort Type", sortType);

	if (sortType == '1') {
		var quer = {createdAt: 'desc'};
	}else if(sortType == '2'){
		var quer = {createdAt: 'asc'}
	}else if(sortType == '3'){
		var quer = {price: 'desc'}
	}else if(sortType == '4'){
		var quer = {price: 'asc'}
	}	
	property
	.find({'verify': false})
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region "
	})
	.limit(perPage)
	.skip(perPage * page)
	.sort(quer)
	.then(doc => {
		if (doc.length > 0) {
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
	.catch(err => console.log(err));

},

getAvilableProperties: function(req,res){
	var perPage = 15;
	const page = req.params.page;
	const sortType = req.params.sortType;
	console.log("Sort Type", sortType);

	if (sortType == '1') {
		var quer = {updatedAt: 'desc'};
	}else if(sortType == '2'){
		var quer = {updatedAt: 'asc'}
	}else if(sortType == '3'){
		var quer = {price: 'desc'}
	}else if(sortType == '4'){
		var quer = {price: 'asc'}
	}		

	property
	.find({'status': 'Available', 'verify': true})
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region "
	})
	.limit(perPage)
	.skip(perPage * page)
	.sort(quer)
	.then(doc => {
		if (doc.length > 0) {
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
	.catch(err => console.log(err));

},

getUnavilableProperties: function(req,res){
	var perPage = 15;
	const page = req.params.page;
	const sortType = req.params.sortType;

	console.log("Sort Type", sortType);

	if (sortType == '1') {
		var quer = {updatedAt: 'desc'};
	}else if(sortType == '2'){
		var quer = {updatedAt: 'asc'}
	}else if(sortType == '3'){
		var quer = {price: 'desc'}
	}else if(sortType == '4'){
		var quer = {price: 'asc'}
	}	
	property
	.find({'status': 'Unavailable', 'verify': true})
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region"
	})
	.limit(perPage)
	.skip(perPage * page)
	.sort(quer)
	.then(doc => {
		if (doc.length > 0) {
			console.log(doc.length);
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
	.catch(err => console.log(err));


},
getUnavilablePropertiesCount: function(req,res){

	property
	.find({'status': 'Unavailable', 'verify': true})
	.count()
	.then(doc => {
		if (doc) {
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
},


getSoldProperties: function(req,res){

	const sortType = req.params.sortType;

	console.log("Sort Type", sortType);

	if (sortType == '1') {
		var quer = {updatedAt: 'desc'};
	}else if(sortType == '2'){
		var quer = {updatedAt: 'asc'}
	}else if(sortType == '3'){
		var quer = {price: 'desc'}
	}else if(sortType == '4'){
		var quer = {price: 'asc'}
	}	

	var perPage = 15;
	const page = req.params.page;
	property
	.find({'status': 'Sold', 'verify': true})
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region"
	})
	.limit(perPage)
	.skip(perPage * page)
	.sort(quer)
	.then(doc => {
		if (doc.length > 0) {
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
	.catch(err => console.log(err));

},

agentWiseProperty: function(req,res){
	var perPage = 15;
	const page = req.params.page;
	const agentId = req.params.id;
	const sortType = req.params.sortType;
	console.log("Sort Type", sortType);
	if (sortType == '1') {
		var quer = {createdAt: 'desc'};
	}else if(sortType == '2'){
		var quer = {createdAt: 'asc'}
	}else if(sortType == '3'){
		var quer = {price: 'desc'}
	}else if(sortType == '4'){
		var quer = {price: 'asc'}
	}	
	property.find({'agent': agentId})
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region -_id"
	})
	.limit(perPage)
	.skip(perPage * page)
	.sort(quer)
	.then(doc => {
		if (doc.length > 0) {
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
	.catch(err => console.log(err));
},

getRentedProperties: function(req,res){

	var perPage = 15;
	const page = req.params.page;
	const sortType = req.params.sortType;
	console.log("Sort Type", sortType);
	if (sortType == '1') {
		var quer = {createdAt: 'desc'};
	}else if(sortType == '2'){
		var quer = {createdAt: 'asc'}
	}else if(sortType == '3'){
		var quer = {price: 'desc'}
	}else if(sortType == '4'){
		var quer = {price: 'asc'}
	}	
	property
	.find({'status': 'Rented', 'verify': true})
	.populate({
		path: 'agent city country propertyType',
		select: "-password -admin -latitude -population -longitude -Province -country -region"
	})
	.limit(perPage)
	.skip(perPage * page)
	.sort(quer)
	.then(doc => {
		if (doc.length > 0) {
			res.status(200).json(doc);
		}else{
			res.status(404).json({message: 'No Valid Proprty Entry Found'});
		}
	})
	.catch(err => console.log(err));
},

agentWiseExpireProperty: function(req,res){
	var perPage = 15;
	const page = req.params.page;
	console.log("GETTING Agent : ID : ",req.params.id);
	var dt = new Date();
	var month = dt.getMonth()-1;  
	if (month < 10) {
		month ="0"+month;
	}
	var day = dt.getDate()-21;
	if (day < 0 ) {
		day = day - (day * 2);
		if (day < 10) {
			day = "0"+day;	
		}
	}
	else if(day > 0 && day < 10){
		day = "0"+day;
	}else if(day == 0){
		day = 21;
	}

	var year = dt.getFullYear();  
	var  old_date = year+'-'+month+'-'+day;
			// old_date = "2018-04-09";
			old_date = new Date(old_date);
			old_date = old_date.toISOString();

			console.log(old_date, "Old Date");
			property.find({'agent': req.params.id ,'createdAt':{ '$lte': old_date }})
			.limit(perPage)
			.skip(perPage * page)
			.populate({
				path: 'agent city country propertyType',
				select: "-password -admin -latitude -population -longitude -Province -country -region -_id"
			}).then(doc => {
				return res.status(200).send(doc);
			}).catch(err=>{return res.status(500).send(err);
			});
		},

		renueRequestAgent: function(req,res){
			console.log(req.body.agent_id, req.body.property_id);
			if (req.body.agent_id == undefined || req.body.property_id == undefined ) {
				return res.status(400).send({
					err: "Bad Request",
					msg: "Invalid Option"
				})
			}
			else{
				property.findOne({'_id': req.body.property_id , 'agent': req.body.agent_id }).exec(function(err,result){
					property.update({'_id': req.body.property_id},{
						renueval: true
					},function(err,result){
						if (result.nModified == 1) {
							res.status(200).send({res:"Success",
								msg: "Proprty Renueval Request !"});
						}else{
							res.status(400).send({ err :"Bad Request",
								msg: "Can't Renueval" });
						}
					})				
				})

			}
		},

		agentWiseExpirePropertyCount: function(req,res){
			console.log("GETTING Agent : ID : ",req.params.id);
			var dt = new Date();
			var month = dt.getMonth()-1;  
			if (month < 10) {
				month ="0"+month;
			}
			var day = dt.getDate()-21;
			if (day < 0 ) {
				day = day - (day * 2);
				if (day < 10) {
					day = "0"+day;	
				}
			}
			else if(day > 0 && day < 10){
				day = "0"+day;
			}else if(day == 0){
				day = 21;
			}

			var year = dt.getFullYear();  
			var  old_date = year+'-'+month+'-'+day;
			// old_date = "2018-04-09";
			old_date = new Date(old_date);
			old_date = old_date.toISOString();

			console.log(old_date, "Old Date");
			property.find({'agent': req.params.id ,'createdAt':{ '$lte': old_date }})
			.count()
			.then(doc => {
				if (doc) {
					return res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Expiring Proprty Found'});
				}
				console.log(doc);
			})
		},

		// renueRequestAgent: function(req,res){
		// 	console.log(req.body.agent_id, req.body.property_id);
		// 	if (req.body.agent_id == undefined || req.body.property_id == undefined ) {
		// 		return res.status(400).send({
		// 			err: "Bad Request",
		// 			msg: "Invalid Option"
		// 		})
		// 	}
		// 	else{
		// 		property.findOne({'_id': req.body.property_id , 'agent': req.body.agent_id }).exec(function(err,result){
		// 			property.update({'_id': req.body.property_id},{
		// 				renueval: true
		// 			},function(err,result){
		// 				if (result.nModified == 1) {
		// 					res.status(200).send({res:"Success",
		// 						msg: "Proprty Renueval Request !"});
		// 				}else{
		// 					res.status(400).send({ err :"Bad Request",
		// 						msg: "Can't Renueval" });
		// 				}
		// 			})				
		// 		})

		// 	}
		// },

		getRentedPropertiesCount: function(req,res){
			property
			.find({'status': 'Rented', 'verify': true})
			.count()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
		},

		agentWisePropertyCount: function(req,res){
			const agentId = req.params.id;	
			property.find({'agent': agentId})
			.count()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
			.catch(err => console.log(err));
		},

		getAvilablePropertiesCount: function(req,res){
			property
			.find({'status': 'Available', 'verify': true})
			.count()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
		},

		getSoldPropertiesCount: function(req,res){
			property
			.find({'status': 'Sold', 'verify': true})
			.count()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
		},

		getAvilablePropertiesCount: function(req,res){
			property
			.find({'status': 'Available','verify': true})
			.count()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
		},

		getUnverifiedPropertiesCount: function(req,res){
			property
			.find({ 'verify': false })
			.count()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
		},


		getProperty: function(req,res){
			console.log("GETTING PROPERTY : ID : ",req.params.id);
			property.find({'_id':req.params.id})
			.populate({
				path: 'agent city country propertyType',
				select: "-password -admin -latitude -population -longitude -Province -country -region"
			})
			.exec(function(err,properties){
				if(err){
					console.error(err)
					return res.status(200).send("ERROR!");
				}
				else{
					return res.status(200).send(properties);
				}
			})
		},


		removeProperty: function(req,res){
			console.log("GETTING PROPERTY : ID : ",req.params.id);
			const id = req.params.id;
			property.remove({ _id: id }).exec().then(result => {
				res.status(200).json({
					message: "property deleted."
				});
			})
			.catch(err =>{
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
		},

		getPropertyByUid: function(req,res){
			let uid  = req.params.uid;
			console.log("GETTING PROPERTY : ID : ",uid);
			property.find({'uniqueId': uid})
			.populate({
				path: 'agent city country propertyType',
				select: "-password -admin -latitude -population -longitude -Province -country -region"
			})
			.exec(function(err,result){
				console.log(result)
				if(err){
					console.error(err)
					return res.status(200).send("ERROR!");
				}
				else{
					return res.status(200).send(result);
				}
			})
		},


		getMaxUniqeId: function(req,res){
			var maxUniqeId = 0;
			property.find( { 'country': req.body.country } ).sort({"_id" : -1}).limit(1)
			.then(doc=>{
				if (doc.length == 1) 
				{
					maxUniqeId = doc[0].uniqueId;
					var length = maxUniqeId.length;
					var trimmedString = maxUniqeId.substring(8, length);
					number = parseInt(trimmedString)+1;		
					var lastYear = maxUniqeId.substring(3, 7);				
					if (req.body.country == '5ab1fc262c1c50037e87adf9' && doc[0].country == '5ab1fc262c1c50037e87adf9') {
						var text = "MA";
					}
					else if (req.body.country == '5ab1fc482c1c50037e87adfd' && doc[0].country == '5ab1fc482c1c50037e87adfd'){
						var text = "TR";
					}
					var dt = new Date();
					var year = dt.getFullYear();
					var unique = '';

					if (year == lastYear) {
						console.log("lastYear", lastYear);
						return res.status(200).send(unique = text+"-"+year+"-"+number);
					}else
					{
						return res.status(200).send(unique = text+"-"+year+"-1");
					}

				}
				else{

				}
			}).catch(err => {
				console.log(err)
				res.status(500).json({
					msg: err
				});
			});
		},


		updateProperty: function(req,res){
			property.findByIdAndUpdate(req.body._id,req.body,function(err,property){
				if(err){
					console.error(err);
					return res.status(200).send("ERROR UPDATING PROPERTY")
				}
				return res.status(200).send(property);
			});
		},

		addProperty: function(req,res){
			var maxUniqeId = '';

			property.find( { 'country': req.body.country } ).sort({"_id" : -1}).limit(1)
			.then(doc=>{
				if (doc.length == 1) 
				{
					maxUniqeId = doc[0].uniqueId;
					var length = maxUniqeId.length;
					var trimmedString = maxUniqeId.substring(8, length);
					number = parseInt(trimmedString)+1;		
					var lastYear = maxUniqeId.substring(3, 7);				
					if (req.body.country == '5ab1fc262c1c50037e87adf9' && doc[0].country == '5ab1fc262c1c50037e87adf9') {
						var text = "MA";
					}
					else if (req.body.country == '5ab1fc482c1c50037e87adfd' && doc[0].country == '5ab1fc482c1c50037e87adfd'){
						var text = "TR";
					}
					var dt = new Date();
					var year = dt.getFullYear();
					var unique = '';

					if (year == lastYear) {
						unique = text+"-"+year+"-"+number;
					}
					else
					{
						unique = text+"-"+year+"-1";
					}

					console.log("unique", unique);

					var status = "Unavailable";

					const Property = new property({
						propertyType: req.body.propertyType, //FROM PROPERTY_TYPE TABLE
						propertyAddress: req.body.propertyAddress,
						agent: req.body.agent, // User Id 
						postalCode: req.body.postalCode,
						city: req.body.city, //ID FROM CITY TABLE
						state: req.body.state,
						country: req.body.country, //ID FROM COUNTRY TABLE
						status: status,
						price: req.body.price,
						currency: req.body.currency,
						rooms: req.body.rooms,
						area: req.body.area,
						buyRent: req.body.buyRent,
						garage: req.body.garage,
						garden: req.body.garden,
						swimmingPool: req.body.swimmingPool,
						lat: req.body.lat,
						lon: req.body.lon,
						additionalInfo: req.body.additionalInfo,
						uniqueId: unique,
						verify: false
					});
					console.log("Property :",Property);
					Property.save().then(result => {
						res.status(200).json(result);
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({
							msg: err
						});
					});
				}
				else{
					number = 0;
					if (req.body.country == '5ab1fc262c1c50037e87adf9' ) {
						var text = "MA";
					}
					else if (req.body.country == '5ab1fc482c1c50037e87adfd'){
						var text = "TR";
					}
					var dt = new Date();
					var year = dt.getFullYear();

					const unique = text+"-"+year+"-"+number;

					var status = '"Unavailable"';

					const Property = new property({
						propertyType: req.body.propertyType, //FROM PROPERTY_TYPE TABLE
						propertyAddress: req.body.propertyAddress,
						agent: req.body.agent, // User Id 
						postalCode: req.body.postalCode,
						city: req.body.city, //ID FROM CITY TABLE
						state: req.body.state,
						country: req.body.country, //ID FROM COUNTRY TABLE
						status: status,
						price: req.body.price,
						currency: req.body.currency,
						rooms: req.body.rooms,
						area: req.body.area,
						buyRent: req.body.buyRent,
						garage: req.body.garage,
						garden: req.body.garden,
						swimmingPool: req.body.swimmingPool,
						lat: req.body.lat,
						lon: req.body.lon,
						additionalInfo: req.body.additionalInfo,
						uniqueId: unique,
						verify: false
					});
					console.log("Property :",Property);
					Property.save().then(result => {
						res.status(200).json(result);
					})
					.catch(err => {
						console.log(err)
						res.status(500).json({
							msg: err
						});
					});
				}
			}).catch(err => {
				console.log(err)
				res.status(500).json({
					msg: err
				});
			});
		},

		changePropertyStatus: function(req,res){
			var newstatus = req.params.status;
			if(newstatus !== 'Available' && newstatus !== 'Unavailable' && newstatus !== 'Sold' && newstatus !== 'Rented'){
				return res.status(400).send({
					err: "Bad Request",
					msg: "Status Invalid"
				})
			}

			property.findOne({'_id': req.params.id}).exec(function(err,result){
				property.update({'_id': req.params.id},{
					status: newstatus
				},function(err,result){
					if (result.nModified == 1) {
						res.status(200).send({res:"Success",
							msg: "Status Update"});
					}else{
						res.status(400).send({ err :"Bad Request",
							msg: "Can't Updated" });
					}
				})				
			})
		},

		VerifyPropertyStatus: function(req,res){
			console.log("[ Change Property Status ]");
			var newstatus = req.params.status;
			console.log(newstatus);
			if(newstatus != 'true' ){
				return res.status(400).send({
					err: "Bad Request",
					msg: "Invalid Option"
				})
			}

			console.log("newstatus = ",newstatus);
			property.findOne({'_id': req.params.id}).exec(function(err,result){
				property.update({'_id': req.params.id},{
					verify: true
				},function(err,result){
					if (result.nModified == 1) {
						res.status(200).send({res:"Success",
							msg: "Proprty Verified !"});
					}else{
						res.status(400).send({ err :"Bad Request",
							msg: "Can't Verify" });
					}


				})				
			})
		},




		buyOrRent: function(req,res){
			const type = req.params.type;
			console.log("rent properties request",type);
			property.find({'buyRent': type , 'status': 'Available', verify: true} )
			.select()
			.populate({
				path: 'agent city country propertyType',
				select: "-password -admin -latitude -population -longitude -Province -country -region -_id"
			})
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
			.catch(err => console.log(err));
		},

		statusWiseProperty: function(req,res){
			const type = req.params.type;
			property.find({'status': 'Unavailable'} )
			.select()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Proprty Entry Found'});
				}
			})
			.catch(err => console.log(err));
		},

		newToOld: function(req,res){
			const type = req.params.type;
			property.find().sort({ _id: -1})
			.select()
			.then(doc => {
				if (doc) {
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Coach Entry Found'});
				}
			})
			.catch(err => console.log(err));
		},

		deleteProperty: function(req,res){
			res.send("DELETE PROPERTY NOT IMPLEMENTED.")
		},

		searchProperty: function(req,res){
			var buyRent = req.body.buyRent;
			var city = req.body.city;
			var country = req.body.country;
			var propertyType = new ObjectId(req.body.propertyType);	
			console.log("GETTING : ",city, country, buyRent, propertyType);
			property.find({$and: [{ 'buyRent': req.body.buyRent },{ 'city': req.body.city },{ 'country': req.body.country } , {'propertyType': req.body.propertyType }, {'status': 'Available' }, {'verify': true}]})
			.populate({
				path: 'agent city country propertyType',
				select: "-password -admin -latitude -population -longitude -Province -country -region -_id"
			})
			.then(doc => {
				if (doc) {
					console.log(doc.length);
					res.status(200).json(doc);
				}else{
					res.status(404).json({message: 'No Valid Entry Found'});
				}
			})
			.catch(err => console.log(err));
		},



		confirmRenueRequestAdmin: function(req,res){
			console.log(req.body.agent_id, req.body.property_id);
			if (req.body.agent_id == undefined || req.body.property_id == undefined ) {
				return res.status(400).send({
					err: "Bad Request",
					msg: "Invalid Option"
				})
			}
			else{
				property.findOne({'_id': req.body.property_id , 'agent': req.body.agent_id }).exec(function(err,result){
					property.update({'_id': req.body.property_id},{
						createdAt: new Date(),
						renueval: false
					},function(err,result){
						if (result.nModified == 1) {
							res.status(200).send({res:"Success",
								msg: "Proprty Renueval Request !"});
						}else{
							res.status(400).send({ err :"Bad Request",
								msg: "Can't Renueval" });
						}
					})				
				})

			}
		},
		getRenueRequests: function(req,res){
			property.find({'renueval': true})
			.populate({
				path: 'agent city country propertyType',
				select: "-password -admin -latitude -population -longitude -Province -country -region -_id"
			}).then(doc => {
				return res.status(200).send(doc);
			}).catch(err=>{return res.status(500).send(err);
			});
		}
	};

	module.exports = propertyController;