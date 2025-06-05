let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let mongoose = require('mongoose');
let { createOrderValidator } = require('./../../validators/customer/order.validator');


exports.createOrder = async (req, res) => {
    try {
        const { error } = createOrderValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ message: 'Validation failed', errors: error.details.map(err => err.message) });
        }

        const { pickAddress, dropAddress, priority, extraDetails } = req.body;
        const user = req.user;

        const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        const order = await mongoose.model('order').create({
            orderNo,
            status: 'created',
            pickAddress,
            dropAddress,
            priority,
            user: [{ id: user._id, name: user.name, type: user.userType }],
            extraDetails
        });

        const tracking = await mongoose.model('orderTracking').create({
            _id: new mongoose.Types.ObjectId(),
            user: { id: user._id, name: user.name, type: user.userType },
            notes: 'Order created',
        });

        order.trackingInfo.push(tracking._id);
        await order.save();

        return res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};