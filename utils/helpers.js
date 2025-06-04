const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN_DAYS}d`,
  });
};

exports.sendOtp = async (mobileNo, otp) => {
  try {
    let link = 'https://api.msg91.com/api/v5/flow';
    let nmessage = {
      flow_id: '623da39a37a33e7a09274378',
      sender: process.env.SMS_SENDER,
      mobiles: `91${mobileNo}`,
      OTP: otp.toString()
    };
    let results = await superagent.post(link).send(nmessage).set('authkey', process.env.SMS_AUTHKEY).set('accept', 'json');
    if (results.body != '') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log('SMS :' + err);
    return false;
  }
};

exports.searchOptimizer = (search) => {
  // let sRegex = /([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/g;
  // return new RegExp(string.replace(sRegex, '\\$1'), 'igm');
  const regex = /[^a-zA-Z0-9\s]/g;
  const escapedQuery = search.trim().replace(regex, '\\$&');
  const wordPatterns = escapedQuery
    .split(/\s+/)
    .map((word) => `(?=.*${word})`)
    .join('');
  const pattern = new RegExp(wordPatterns, 'gim');
  return pattern;
};

exports.toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};