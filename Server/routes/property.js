var express = require('express');
var router = express.Router();
var PROPERTY = require('../controllers/property.controller');
var auth = require('./auth');
// router.get('/',auth.isAuthenticatedJWT,PROPERTY.getProperties);
router.get('/',auth.isAuthenticatedJWT,PROPERTY.getProperties);

router.get('/available/:page/:sortType',auth.isAuthenticatedJWT,PROPERTY.getAvilableProperties);
router.get('/availableCount',auth.isAuthenticatedJWT,PROPERTY.getAvilablePropertiesCount);

router.get('/blocked/:page/:sortType',auth.isAuthenticatedJWT,PROPERTY.getUnavilableProperties);
router.get('/blockedCount',auth.isAuthenticatedJWT,PROPERTY.getUnavilablePropertiesCount);

router.get('/rented/:page/:sortType',auth.isAuthenticatedJWT,PROPERTY.getRentedProperties);
router.get('/rentedCount',auth.isAuthenticatedJWT,PROPERTY.getRentedPropertiesCount);

router.get('/sold/:page/:sortType',auth.isAuthenticatedJWT,PROPERTY.getSoldProperties);
router.get('/soldCount',auth.isAuthenticatedJWT,PROPERTY.getSoldPropertiesCount);

router.get('/unVerified/:page/:sortType',auth.isAuthenticatedJWT,PROPERTY.getUnverifiedProperties);
router.get('/unVerifiedCount',auth.isAuthenticatedJWT,PROPERTY.getUnverifiedPropertiesCount);

router.get('/',auth.isAuthenticatedJWT,PROPERTY.getProperties);

router.get('/:id',PROPERTY.getProperty);
router.delete('/:id',auth.isAuthenticatedJWT,PROPERTY.removeProperty);

router.post('/unique/',PROPERTY.getMaxUniqeId);
router.get('/uid/:uid',auth.isAuthenticatedJWT,PROPERTY.getPropertyByUid);

// router.post('/',auth.isAuthenticatedJWT,PROPERTY.addProperty);
router.post('/',auth.isAuthenticatedJWT,PROPERTY.addProperty);
router.post('/mass-upload',PROPERTY.massUpload);
router.post('/imageUpload',PROPERTY.testUpload);
router.put('/',auth.isAuthenticatedJWT,PROPERTY.updateProperty);

router.get('/agentWiseProperty/:id/:page/:sortType',auth.isAuthenticatedJWT,PROPERTY.agentWiseProperty);
router.get('/agent-wise-property-count/:id',auth.isAuthenticatedJWT,PROPERTY.agentWisePropertyCount);

router.get('/agentWiseExpireProperty/:id/:page',auth.isAuthenticatedJWT,PROPERTY.agentWiseExpireProperty);
router.get('/agentWiseExpirePropertyCount/:id',auth.isAuthenticatedJWT,PROPERTY.agentWiseExpirePropertyCount);


router.get('/buyOrRent/:type',PROPERTY.buyOrRent);
router.get('/change-status/:id/:status',auth.isAuthenticatedJWT,PROPERTY.changePropertyStatus);
router.get('/verify/:id/:status',auth.isAuthenticatedJWT,PROPERTY.VerifyPropertyStatus);
router.post('/searchProperty/',PROPERTY.searchProperty);

router.post('/renueRequestAgent/',auth.isAuthenticatedJWT,PROPERTY.renueRequestAgent);
router.post('/confirmRenueRequestAdmin/',auth.isAuthenticatedJWT,PROPERTY.confirmRenueRequestAdmin);
router.get('/renue/get-renue-requests/',auth.isAuthenticatedJWT,PROPERTY.getRenueRequests);

module.exports = router;