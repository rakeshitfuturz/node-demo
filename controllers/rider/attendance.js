let response = require('../../utils/response');
let models = require('../../models/zindex');
let mongoose = require('mongoose');
const moment = require('moment');
let { setAttendanceValidator, getAttendanceValidator } = require('../../validators/rider/attendence.validator');

exports.setAttendance = async (req, res) => {
    try {
      const { error } = setAttendanceValidator.validate(req.body);
      if (error) {
        return response.badRequest('Invalid request!', res);
      }
  
      const { status, date, desc, extraDetails, dutyTracking } = req.body;
      const riderId = req.token.riderId;
      const riderName = req.token.name;
  
      // Date validation
      const currentDate = moment(new Date());
      const inputDate = moment(new Date(date));
  
      if (status === 'absent' && moment(inputDate).isBefore(currentDate)) {
        return response.badRequest('Cannot set absent for past dates!', res);
      }
  
      // Check for existing attendance
      const existingAttendance = await models.attendence.findOne({
        'user.id': riderId,
        date: {
          $gte: inputDate,
          $lt: moment(inputDate).add(1, 'day')
        }
      });
  
      if (existingAttendance) {
        return response.badRequest('Attendance already set for this date!', res);
      }
  
      // Determine isDuty based on dutyTracking
      const isDuty = Array.isArray(dutyTracking) && dutyTracking.some(entry => entry.dutyType === 'dutyOn');
  
      // Check if this is the first attendance for the rider
      const priorAttendance = await models.attendence.findOne({ 'user.id': riderId });
      const isFirstAttendance = !priorAttendance;
      const isAttendance = isFirstAttendance && ['fullDay', 'halfDay'].includes(status);
  
      if(moment(inputDate).format('YYYY-MM-DD').toString() == moment(currentDate).format('YYYY-MM-DD').toString()){
        await models.rider.updateOne(
            { _id: riderId },
            { 
              $set: { 
                isDuty,
                isAttendance: isAttendance ? true : undefined
              }
            }
          );
      }
  
      const attendance = new models.attendence({
        user: {
          id: riderId,
          name: riderName,
          type: 'rider'
        },
        status,
        date: inputDate,
        desc: desc || '',
        extraDetails: extraDetails || null,
        dutyTracking: dutyTracking || []
      });
  
      await attendance.save();
  
      return response.success('Attendance set successfully', attendance, res);
    } catch (error) {
      console.log(error);
      return response.error('Server error', error.message, res);
    }
  };

exports.getAttendance = async (req, res) => {
  try {
    const { error } = getAttendanceValidator.validate(req.body);
    if (error) {
      return response.badRequest('Invalid request!', res);
    }

    const { status, startDate, endDate, page, limit } = req.body;
    const riderId = req.token.riderId;
    
    const query = { 'user.id': riderId };
    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { date: -1 }
    };

    const result = await models.attendence.paginate(query, options);

    return response.success('Attendance retrieved successfully', result, res);
  } catch (error) {
    return response.error('Server error', error.message, res);
  }
};