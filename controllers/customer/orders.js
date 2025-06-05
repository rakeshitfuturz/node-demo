let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let mongoose = require('mongoose');
let { createOrderValidator } = require('./../../validators/customer/order.validator');


exports.createOrder = async (req, res) => {
    try {
        const { error } = createOrderValidator.validate(req.body);
        if (error) {
            return response.badRequest("Invalid request!", res);
        }

        const { pickAddress, dropAddress, priority, extraDetails } = req.body;
        const user = req.token;

        const orderNo = `ORD-${Date.now()}`;

        const order = await models.order.create({
            orderNo,
            status: 'created',
            pickAddress,
            dropAddress,
            priority,
            user: [{ id: user.customerId, name: user.name, type: user.userType }],
            extraDetails
        });

        const tracking = await models.orderTracking.create({
            _id: new mongoose.Types.ObjectId(),
            user: { id: user.customerId, name: user.name, type: user.userType },
            notes: 'Order created',
            extraDetails:{
                orderId:order._id
            }
        });

        order.trackingInfo.push(tracking._id);
        await order.save();

        return response.success('Order created successfully', order ,res);
    } catch (error) {
        console.log(error);
        return response.error('Server error', error.message);
    }
};