var express = require('express');
var router = express.Router();
var ADMIN = require('../controllers/admin.controller');
var auth = require('./auth');

router.post('/', ADMIN.createAdmin);
router.post('/contactUs',ADMIN.contactUs);
module.exports = router;


