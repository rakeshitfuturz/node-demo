let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let { generateAccessToken } = require('./../../middlewares/authenticator');
const { encrypt, decrypt } = require('../../utils/encryptor');
const helpers = require("./../../utils/helpers");
exports.login = async (req, res) => {
    try {
      let { mobile,udId } = req.body;
      let riderExists = await models.rider.findOne({ mobile: mobile, isDeleted: false }).lean();
      if (!riderExists) return response.success('user not exists.', 0, res);
      if (!riderExists.isActive) return response.success('your account has been deactivated, please contact administrator.', 0, res);
      if (riderExists.udId == udId || riderExists.udId == null) {
        let updateQuery = {};
        if (riderExists.isVerified == true) {
          riderExists.udId = updateQuery.udId = udId;
        }
        await models.rider.findByIdAndUpdate(riderExists._id, updateQuery, { new: true });
        let dataset = { riderId: riderExists._id ,name:riderExists.name,userType:'rider'}
        riderExists.accessToken = generateAccessToken(dataset);
        return response.success('valid rider.', riderExists, res);
    }
    return response.success('This device is unauthorized!', 0, res);
    } catch (err) {
      console.error(err);
      return response.error(err, res);
    }
  };

  exports.verifyOTP = async (req, res) => {
    try {
      let { mobile, code ,udId } = req.body;
      let user = await models.rider.findOne({ mobile: mobile, code: code }).lean();
      if (!user) return response.success('wrong OTP provided, please try again!', 0, res);
      await models.rider.findByIdAndUpdate(user._id, { isVerified: true ,udId:udId || null}, { new: true });
      return response.success('user verified.', 1, res);
    } catch (err) {
      console.log(err);
      return response.error(err, res);
    }
  };
  
  exports.sendOTP = async (req, res) => {
    try {

      let { mobile, code } = req.body;
  
      let user = await models.rider.findOne({ mobile: mobile }).lean();
      if (user) {
        if (user.isDeleted == true) return response.success('user not exists', 0, res);
        await models.rider.findByIdAndUpdate(user._id, { code }, { new: true });
        await helpers.sendOtp(mobile, code);
        return response.success('OTP send successfully.', 1, res);
      } else {
        return response.success('OTP failed!', 0, res);
      }
    } catch (err) {
      console.log(err);
      return response.error(err, res);
    }
  };
