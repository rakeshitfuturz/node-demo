var express = require('express');
var router = express.Router();
const authController = require('../controllers/customer/authentication');
const { isCustomer } = require('../middlewares/authenticator');
const ordersCtrl = require('../controllers/customer/orders');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/createOrder', isCustomer, ordersCtrl.createOrder);
router.post('/listOrders', isCustomer, ordersCtrl.listOrders);
module.exports = router;
