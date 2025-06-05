let response = require('../../utils/response');
let models = require('../../models/zindex');
let mongoose = require('mongoose');
let { listRiderOrdersValidator , updateOrderStatusValidator } = require('../../validators/rider/order.validator');

exports.listRiderOrders = async (req, res) => {
    try {
        const { error } = listRiderOrdersValidator.validate(req.body);
        if (error) {
            return response.badRequest("Invalid request!", res);
        }

        const { status, page, limit } = req.body;
        const riderId = req.token.riderId;

        const query = { 'rider.id': riderId };
        if (status) {
            query.status = status;
        }
        if (status == 'created') {
            return response.badRequest("Invalid status!", res);
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

exports.updateOrderStatus = async (req, res) => {
    try {
        const { error } = updateOrderStatusValidator.validate(req.body);
        if (error) {
            return response.badRequest("Invalid request!", res);
        }
        let files = req.files;
        const { orderId, addressId, addressType, status, notes, extraDetails } = req.body;
        const user = req.token;
        let images = [];
        for (let file in files) {
            images.push(files[file][0].key);
          }
        const order = await models.order.findOne(orderId);
        if (!order) {
            return response.notFound("Order not found!", res);
        }

        if (order.rider.id.toString() !== user.riderId.toString()) {
            return response.forbidden("Unauthorized to update this order!", res);
        }

        // Update pick or drop address
        let addressUpdated = false;
        if (addressType === 'pick') {
            const pickAddress = order.pickAddress.find(addr => addr._id.toString() === addressId);
            if (pickAddress) {
                pickAddress.isPicked = true;
                addressUpdated = true;
            }
        } else if (addressType === 'drop') {
            const dropAddress = order.dropAddress.find(addr => addr._id.toString() === addressId);
            if (dropAddress) {
                dropAddress.isDelivered = true;
                addressUpdated = true;
            }
        }

        if (!addressUpdated) {
            return response.notFound("Address not found!", res);
        }

        // Update order status
        order.status = status;

        // Check for partial or complete pick/deliver
        const allPicked = order.pickAddress.every(addr => addr.isPicked);
        const allDelivered = order.dropAddress.every(addr => addr.isDelivered);

        if (status === 'partial picked' && allPicked) {
            order.status = 'picked';
        } else if (status === 'partial delivered' && allDelivered) {
            order.status = 'delivered';
        }

        // Create tracking entry
        const tracking = await models.orderTracking.create({
            _id: new mongoose.Types.ObjectId(),
            addressId,
            addressType,
            user: { id: user._id, name: user.name, type: user.userType },
            images: files || [],
            notes: notes || '',
            extraDetails: extraDetails || { status }
        });

        order.trackingInfo.push(tracking._id);
        await order.save();

        return response.success('Order status updated successfully', order ,res);
    } catch (error) {
        return response.error('Server error', error.message);
    }
};
