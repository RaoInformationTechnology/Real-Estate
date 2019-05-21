var express = require('express');
var router = express.Router();
var CITY = require('../controllers/city.controller');
var auth = require('./auth');

router.get('/',CITY.getCities);
router.post('/countryWiseCities',CITY.getCitiesByCountryId);
router.post('/',CITY.createCity);
router.get('/:name',CITY.getCityDetials);
router.put('/',CITY.updateCity);
router.post('/world-cities-by-country',CITY.getWorldCitiesByCountryId);
router.post('/world-city',CITY.createWorldCity);
router.get('/world-city/:name',CITY.getWorldCityDetials);
router.put('/world-city',CITY.updateWorldCity);

module.exports = router;