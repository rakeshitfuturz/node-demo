var express = require('express');
var router = express.Router();
const authController = require('../controllers/admin/authentication');
const { isAdmin } = require('../middlewares/authenticator');
const files = require('../utils/flieUtils');
const constant = require('../config/constants');
const ridersCtrl = require('../controllers/admin/rider.ctrl');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/saveRiders', isAdmin, files.uploadToAWS(constant.RIDER_PATH).fields(constant.RIDER_IMAGES_LIST), ridersCtrl.save);
module.exports = router;
