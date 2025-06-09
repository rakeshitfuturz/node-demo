var express = require('express');
var router = express.Router();
const authController = require('../controllers/admin/authentication');
const { isAdmin } = require('../middlewares/authenticator');
const files = require('../utils/flieUtils');
const constant = require('../config/constants');
const ridersCtrl = require('../controllers/admin/rider.ctrl');
const ordersCtrl = require('../controllers/admin/orders.ctrl');
const attendanceCtrl = require('../controllers/admin/attendence');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/saveRiders', isAdmin, files.uploadToAWS(constant.RIDER_PATH).fields(constant.RIDER_IMAGES_LIST), ridersCtrl.save);
// router.get('/listRiders', isAdmin, ridersCtrl.list);
//orders
router.post('/listOrders', isAdmin, ordersCtrl.listOrders);
router.post('/assignOrder', isAdmin, ordersCtrl.assignOrder);
router.post('/listAvailableRiders', isAdmin, ordersCtrl.listAvailableRiders);
//attendance
router.post('/getAttendance', isAdmin, attendanceCtrl.getAttendance);
module.exports = router;
