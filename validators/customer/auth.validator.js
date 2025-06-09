const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    mobile: Joi.string().required().messages({
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required'
    }),
    emailId: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    }),
    address: Joi.object().optional(),
    gst: Joi.object({
        gstNumber: Joi.string().allow('').optional(),
        gstBusinessName: Joi.string().allow('').optional(),
        isUpdated: Joi.boolean().default(false)
    }).optional(),
    bankName: Joi.string().allow('').optional(),
    accountNo: Joi.string().allow('').optional(),
    ifscCode: Joi.string().allow('').optional(),
    upiId: Joi.string().allow('').optional(),
    userType: Joi.string().default('customer').optional(),
    businessType: Joi.string().valid('B2B', 'B2C', 'BOTH').default('B2C').optional(),
    isVerified: Joi.boolean().default(false).optional(),
    isActive: Joi.boolean().default(true).optional(),
    isApproved: Joi.boolean().default(false).optional(),
    isDeleted: Joi.boolean().default(false).optional(),
    creditLimit: Joi.string().allow('').optional(),
    extraDetails: Joi.object().optional()
}).unknown(true);