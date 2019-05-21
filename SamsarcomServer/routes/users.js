var express = require('express');
var router = express.Router();
var USER = require('../controllers/user.controller');
var auth = require('./auth');

// router.get('/',auth.isAuthenticatedJWT,auth.isAuthenticated, USER.getUsers);
// router.post('/login', USER.login);
// router.post('/', USER.signup);
// router.get('/:id',auth.isAuthenticatedJWT,auth.isAuthenticated, USER.getUser);
// router.put('/',auth.isAuthenticatedJWT,auth.isAuthenticated, USER.updateUser);

router.get('/',auth.isAuthenticatedJWT, USER.getUsers);
router.post('/login', USER.login);
router.post('/password-change', USER.passwordChange);
router.post('/', USER.signup);
router.get('/checkAvailability/:id', USER.ckeckAvailibity);
router.post('/fbLogin', USER.fbLogin);
router.post('/userVerification', USER.userVerfication);
router.post('/newCodeGenerate', USER.generateNewVerificationCode);
router.get('/:id',auth.isAuthenticatedJWT, USER.getUser);
router.put('/',auth.isAuthenticatedJWT, USER.updateUser);
router.get('/full-information/:id',auth.isAuthenticatedJWT, USER.getUsersInformation);
router.get('/single-information/:id',auth.isAuthenticatedJWT, USER.getUserInformation);
// router.post('/sendMessage',auth.isAuthenticatedJWT, USER.sendMail);
module.exports = router;


