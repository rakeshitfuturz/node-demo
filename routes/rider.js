var express = require('express');
var router = express.Router();
const authController = require('../controllers/rider/authentication');
const { isRider } = require('../middlewares/authenticator');

router.post('/login', authController.login);
router.post('/register', authController.verifyOTP);
router.post('/sendOTP', authController.sendOTP);
module.exports = router;
