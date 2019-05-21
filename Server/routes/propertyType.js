var express = require('express');
var router = express.Router();
var PROPERTYTYPE = require('../controllers/propertyType.controller');
var auth = require('./auth');

router.get('/',PROPERTYTYPE.getPropertyTypes);
router.get('/:id',auth.isAuthenticatedJWT,PROPERTYTYPE.getPropertyType);
router.post('/',PROPERTYTYPE.createPropertyType);
router.put('/',auth.isAuthenticatedJWT,PROPERTYTYPE.updatePropertyType);

module.exports = router;