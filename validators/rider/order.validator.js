const Joi = require('joi');

exports.listRiderOrdersValidator = Joi.object({
    status: Joi.string().valid('created', 'partial picked', 'picked', 'running', 'return', 'delivered', 'partial delivered', 'cancelled', 'assigned').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

exports.updateOrderStatusValidator = Joi.object({
    orderId: Joi.string().required(),
    addressId: Joi.string().required(),
    addressType: Joi.string().valid('pick', 'drop').required(),
    status: Joi.string().valid('partial picked', 'picked', 'partial delivered', 'delivered', 'running', 'return', 'cancelled').required(),
    images: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().allow('').optional(),
    extraDetails: Joi.object().optional()
});