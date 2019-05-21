const mongoose = require('mongoose');
var admin = require('../models/admin.schema');
var jwt = require('jsonwebtoken');
var mailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');

let adminController = {

	updateUser: function(req,res){
		console.log(req.body);
		user.findByIdAndUpdate(req.body._id,req.body,function(err,user){
			if(err){
				console.error(err);
				return res.send("ERROR UPDATING USER")
			}
			return res.send(user);
		});
	},

	createAdmin: function(req,res,next){
		const Admin = new admin({
			_id: mongoose.Types.ObjectId(),
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			country: req.body.country,
			email: req.body.email,
			phone: req.body.phone,
			mobile: req.body.mobile,
			password: req.body.password
		});

		Admin.save().then(result => {
			res.status(200).json(result);
		})
		.catch(err => console.log(err));

	},

	contactUs:(req,res)=>{

		var output = '<!DOCTYPE html><html><head><style>table {border-collapse: collapse;width: 100%;}th, td {text-align: left;padding: 8px;}tr:nth-child(even){background-color: #f2f2f2}</style></head><body><h2>samsarcom.be Contact Us Request</h2><div style="overflow-x:auto;"><table><tr><td>Name</td><td>';
		output = output + req.body.name + '</td></tr><tr><td>Email</td><td>';
		output = output + req.body.email + '</td></tr><tr><td>Phone No.</td><td>';
		output = output + req.body.phone + '</td></tr><tr><td>Message</td><td>';
		output = output + req.body.message + '</td></tr></table></div></body></html>';


		var aws = { key: 'AKIAIH7WL3IYEOGOCR3Q', secret: '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', amazon: 'eu-west-1' };

		var transporter = mailer.createTransport(ses({
			accessKeyId: aws.key,
			secretAccessKey: aws.secret,
			region: aws.amazon
		}));

		transporter.sendMail({
			from: 'info@samsarcom.be',
			to: 'info@samsarcom.be',
			bcc: '',
			subject: 'Inquiry : Contact Us',
			html: output
			// attachments: attachments ? attachments : null
		}, function (err, result) {
			if (!err) {

				return res.status(200).send(result);
			}
			else{
				return res.status(500).send(err);
			}
		})
	}

};

module.exports = adminController

