const Joi = require('joi');
exports.assignOrderValidator = Joi.object({
    orderId: Joi.string().required(),
    riderId: Joi.string().required(),
    riderName: Joi.string().required()
});