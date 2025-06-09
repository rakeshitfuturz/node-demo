const Joi = require('joi');
const dutyTrackingValidator = Joi.object({
    coords: Joi.string().allow('').optional(),
    date: Joi.date().optional(),
    dutyType: Joi.string().valid('dutyOn', 'dutyOff', 'empty', '').default('empty').optional()
  });
  
  // Validation schema for setting attendance
  exports.setAttendanceValidator = Joi.object({
    status: Joi.string().valid('fullDay', 'halfDay', 'absent').required(),
    date: Joi.date().required(),
    desc: Joi.string().allow('').optional(),
    extraDetails: Joi.object().optional(),
    dutyTracking: Joi.array().items(dutyTrackingValidator)
  });
  
  // Validation schema for getting attendance (unchanged)
  exports.getAttendanceValidator = Joi.object({
    status: Joi.string().valid('fullDay', 'halfDay', 'absent').optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  });