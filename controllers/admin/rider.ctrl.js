let response = require('../../utils/response');
let models = require('../../models/zindex');
let { generateAccessToken } = require('../../middlewares/authenticator');
const { encrypt , decrypt } = require('../../utils/encryptor');
const helpers = require("../../utils/helpers");
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const authValidator = require('../../validators/admin/auth.validator');

exports.save = async (req, res) => {
    try {
      let files = req.files;
      let request = await authValidator.ridersValidator.validateAsync(req.body);
      for (let file in files) {
        request[file] = files[file][0].key;
      }
      let ridersModel = models.rider;
      request.salary = {
        type: request.salaryType,
        amount: request.salaryAmount
      };
      delete request.salaryType;
      delete request.salaryAmount;
  
      if (request.id == '0' || request.id == null) {
        let result = await ridersModel.findOne({ mobile: request.mobile });
        if (result != null) {
          return response.success('rider is already exist', 0, res);
        } else {
          delete request.id;
          request.name = helpers.toTitleCase(request.name);

          let data = await ridersModel.create(request);
          return response.success('Rider Created Successfully', data, res);
        }
      } else {
        if (mongoose.isValidObjectId(request.id)) {
          let data = await ridersModel.findByIdAndUpdate(request.id, request).lean();
          return response.success('Rider Data Update Successfully', data, res);
        } else {
          return response.success('Rider is Not Available', 0, res);
        }
      }
    } catch (err) {
      console.log(err.message);
      return response.error(err, res);
    }
  };