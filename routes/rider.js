var express = require('express');
var router = express.Router();
const authController = require('../controllers/rider/authentication');
const { isRider } = require('../middlewares/authenticator');
const ordersCtrl = require('../controllers/rider/orders.ctrl');
const files = require('../utils/flieUtils');
const constant = require('../config/constants');

router.post('/login', authController.login);
router.post('/register', authController.verifyOTP);
router.post('/sendOTP', authController.sendOTP);
router.post('/listOrders', isRider, ordersCtrl.listRiderOrders);
router.post('/updateOrderStatus', isRider, files.uploadToAWS(constant.ORDER_PATH).fields(constant.ORDER_IMAGES_LIST), ordersCtrl.updateOrderStatus);
module.exports = router;
