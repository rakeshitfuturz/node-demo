let response = require('../../utils/response');
let models = require('../../models/zindex');
let mongoose = require('mongoose');
let { assignOrderValidator ,listOrdersValidator} = require('../../validators/admin/order.validor');

exports.assignOrder = async (req, res) => {
    try {
        const { error } = assignOrderValidator.validate(req.body);
        if (error) {
            return response.badRequest("Invalid request!", res);
        }

        const { orderId, riderId, riderName } = req.body;
        const user = req.token;

        const order = await models.order.findById(orderId);
        if (!order) {
            return response.notFound("Order not found!", res);
        }

        if (order.status !== 'created') {
            return response.badRequest("Order cannot be assigned in current status!", res);
        }

        order.rider = { id: riderId, name: riderName };
        order.status = 'assigned';
        await order.save();

        // Create tracking entry
        const tracking = await models.orderTracking.create({
            _id: new mongoose.Types.ObjectId(),
            user: { id: user.adminId, name: user.name, type: user.userType },
            notes: `Order assigned to rider ${riderName}`,
            extraDetails: { status: 'assigned', riderId }
        });

        order.trackingInfo.push(tracking._id);
        await order.save();

        return response.success('Order assigned successfully', order ,res);
    } catch (error) {
        return response.error('Server error', error.message);
    }
};

exports.listOrders = async (req, res) => {
    try {
        const { error } = listOrdersValidator.validate(req.body);
        if (error) {
            return response.badRequest("Invalid request!", res);
        }

        const { customerId, status, page, limit } = req.body;
        const query = {};

        if (customerId) {
            query['user.id'] = customerId;
        }
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