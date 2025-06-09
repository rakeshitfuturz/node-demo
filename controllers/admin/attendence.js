let response = require('../../utils/response');
let models = require('../../models/zindex');
let mongoose = require('mongoose');
const moment = require('moment');

exports.getAttendance = async (req, res) => {
  try {
    const { error } = getAttendanceValidator.validate(req.body);
    if (error) {
      return response.badRequest('Invalid request!', res);
    }

    const { riderId,status, startDate, endDate, page, limit } = req.body;
    
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

exports.setAttendance = async (req, res) => {
  try {
    const { error } = setAttendanceValidator.validate(req.body);
    if (error) {
      return response.badRequest('Invalid request!', res);
    }

    const { riderId, status, date, desc, extraDetails, dutyTracking } = req.body;

    // Verify rider exists
    const targetRider = await models.rider.findById(riderId);
    if (!targetRider) {
      return response.badRequest('Rider not found!', res);
    }

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

    // Update rider's isDuty and isAttendance
    await models.rider.updateOne(
      { _id: riderId },
      { 
        $set: { 
          isDuty,
          isAttendance: isAttendance ? true : undefined // Only set if true to avoid overwriting
        }
      }
    );

    // Create new attendance record
    const attendance = new models.attendence({
      user: {
        id: riderId,
        name: targetRider.name,
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
