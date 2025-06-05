let joi = require('joi');

exports.ridersValidator = joi
  .object()
  .keys({
    id: joi.string().required(),
    name: joi.string().required(),
    mobile: joi.string().length(10).required(),
    emailId: joi.string().default('').allow(''),
    dateOfBirth: joi.string().default('').allow(''),
    address: joi.string().required(),
    pincode: joi.string().required(),
    panNumber: joi.string().length(10).default('').allow(''),
    vehicleName: joi.string().required(),
    vehicleNumber: joi.string().default('').allow(''),
    drivingLicenceNumber: joi.string().default('').allow(''),
    rcBookNumber: joi.string().default('').allow(''),
    upiId: joi.string().default('').allow(''),
    bankName: joi.string().default('').allow(''),
    bankAccountNumber: joi.string().default('').allow(''),
    ifscCode: joi.string().default('').allow(''),
    byPassPIN: joi.string().default('7890'),
    salaryType: joi.string().required(),
    salaryAmount: joi.string().default(null)
  })
  .unknown(true);