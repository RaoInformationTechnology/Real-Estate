var express = require('express');
var router = express.Router();
var COUNTRY = require('../controllers/country.controller');
var auth = require('./auth');

router.get('/',COUNTRY.getCountries);
router.get('/world-countries',COUNTRY.getWorldCountries);

module.exports = router;