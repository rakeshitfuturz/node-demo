const Joi = require('joi');

exports.createOrderValidator = Joi.object({
    pickAddress: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            mobile: Joi.array().items(
                Joi.object({
                    type: Joi.string().valid('tel', 'phone', 'whatsapp').default('phone'),
                    value: Joi.string().required()
                })
            ).required(),
            address: Joi.string().required(),
            coords: Joi.string().allow('').optional(),
            packageDetails: Joi.object().optional(),
            extraDetails: Joi.object().optional()
        })
    ).min(1).required(),
    dropAddress: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            mobile: Joi.array().items(
                Joi.object({
                    type: Joi.string().valid('tel', 'phone', 'whatsapp').default('phone'),
                    value: Joi.string().required()
                })
            ).required(),
            address: Joi.string().required(),
            coords: Joi.string().allow('').optional(),
            packageDetails: Joi.object().optional(),
            extraDetails: Joi.object().optional()
        })
    ).min(1).required(),
    priority: Joi.boolean().default(false),
    extraDetails: Joi.object().optional()
});

