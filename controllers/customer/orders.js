let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let mongoose = require('mongoose');
let { createOrderValidator , listCustomerOrdersValidator } = require('./../../validators/customer/order.validator');


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

exports.listOrders = async (req, res) => {
    try {
        const { error } = listCustomerOrdersValidator.validate(req.body);
        if (error) {
            return response.badRequest("Invalid request!", res);
        }

        const { status, page, limit } = req.body;
        const customerId = req.token.customerId;

        const query = { 'user.id': customerId };
        if (status) {
            query.status = status;
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }
        };

        const result = await models.order.paginate(query, options);

        return response.success('Orders retrieved successfully', result, res);
    } catch (error) {
        return response.error('Server error', error.message);
    }
};
