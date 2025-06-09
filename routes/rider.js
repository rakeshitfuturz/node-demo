var express = require('express');
var router = express.Router();
const authController = require('../controllers/rider/authentication');
const { isRider } = require('../middlewares/authenticator');
const ordersCtrl = require('../controllers/rider/orders.ctrl');
const attendanceCtrl = require('../controllers/rider/attendance');
const files = require('../utils/flieUtils');
const constant = require('../config/constants');

//auth
router.post('/login', authController.login);
router.post('/register', authController.verifyOTP);
router.post('/sendOTP', authController.sendOTP);
router.post('/whoAmI', isRider, authController.whoAmI);

//orders
router.post('/listOrders', isRider, ordersCtrl.listOrders);
router.post('/updateOrderStatus', isRider, files.uploadToAWS(constant.ORDER_PATH).fields(constant.ORDER_IMAGES_LIST), ordersCtrl.updateOrderStatus);

//attendance
router.post('/setAttendance', isRider, attendanceCtrl.setAttendance);
router.post('/getAttendance', isRider, attendanceCtrl.getAttendance);
module.exports = router;
