const Joi = require('joi');
exports.assignOrderValidator = Joi.object({
    orderId: Joi.string().required(),
    riderId: Joi.string().required(),
    riderName: Joi.string().required()
});

exports.listOrdersValidator = Joi.object({
    customerId: Joi.string().optional(),
    status: Joi.string().valid('created', 'partial picked', 'picked', 'running', 'return', 'delivered', 'partial delivered', 'cancelled', 'assigned').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});