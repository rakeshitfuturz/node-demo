let response = require('../../utils/response');
let models = require('../../models/zindex');
let mongoose = require('mongoose');
const moment = require('moment');
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
        console.log(error);
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

exports.listAvailableRiders = async(req,res)=>{
    try{
        const orderModel = models.order;
        const riderModel = models.rider;

        const date = new Date();
        const query = { status: {$ne: 'created'}};
        if (date) {
            query.createdAt = { $gte: moment(date).startOf('day').toDate(), $lte: moment(date).endOf('day').toDate() };
          }

        const results = await orderModel.aggregate([
            {
                $match: query
            },
            {
                $project: {
                    _id: 1,
                    rider: 1
                }
            }
        ]);

        const riderIds = results.map(order => new mongoose.Types.ObjectId(order.rider.id));
        const riders = await riderModel.find({ _id: { $nin: riderIds } }).select('_id name');

        return response.success('Available riders retrieved successfully', riders, res);
    }catch (error) {
        console.log(error);
        return response.error('Server error', error.message);
    }
}