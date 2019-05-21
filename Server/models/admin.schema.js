var mongoose = require('mongoose');
var Country = require('./country.schema');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var adminSchema = new mongoose.Schema({  
	firstName: String,
	lastName: String,
	country: {
		type: mongoose.Schema.ObjectId,
		ref: Country
	}, //ID FROM COUNTRY TABLE
	email: String,
	phone: String,
	mobile: String,
	password: String
});

adminSchema.pre('save', function(next) {
	var admin = this;
	console.log("IN PRE SAVE SECTION")
	// if (!user.isModified()){
	// 	console.log("NO MODIFIED");
	// 	return next();
	// }

	console.log("IS MODIFIED");
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);
		console.log("SALT = ",salt);
		console.log("DATA = ",admin);
		bcrypt.hash(admin.password, salt, function(err, hash) {
			if (err){ 
				console.error("ERROR ",err);
				return next(err);
			}
			admin.password = hash;
			console.log("Admin = ",admin);
			console.log("NEW PASSWORD : ",hash);
			next();
		});
	});
});

adminSchema.methods.comparePassword = function(candidatePassword, cb) {
	console.log("COMPARING PASSWORDS");
	console.log("CANDIDATE PASSWORD = ",candidatePassword);
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('Admin', adminSchema);  