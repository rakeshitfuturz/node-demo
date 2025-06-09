let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let { generateAccessToken } = require('./../../middlewares/authenticator');
const { encrypt, decrypt } = require("../../utils/encryptor");
const authValidator = require('./../../validators/customer/auth.validator');
exports.login = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        // Validate that either email or mobile is provided, along with password
        if ((!email && !mobile) || !password) {
            return response.badRequest("Email or mobile number and password are required!", res);
        }

        // Query user by email or mobile
        let user = await models.customer.findOne({
            $or: [
                { emailId: email || '' },
                { mobile: mobile || '' }
            ]
        });

        if (!user) {
            return response.unauthorized("Invalid credentials!", res);
        }

        // Verify password
        let isMatch = decrypt(user.password) === password;
                if (!isMatch) {
                    return response.unauthorized("Invalid credentials!", res);
                }

        // Generate access token
        let token = generateAccessToken({
            customerId: user._id,
            name: user.name,
            userType: "customer",
            customerType:user.customerType
        });

        return response.success('Login successful.', { token }, res);
    } catch (error) {
        return response.error(error, res);
    }
}

exports.register = async (req, res) => {
    try {
        let { error, value } = authValidator.registerSchema.validate(req.body);
        if (error) {
            return response.badRequest(error, res);
        }

        // Check for existing user
        let user = await models.customer.findOne({ $or: [{ emailId: value.emailId }, { mobile: value.mobile }] }).lean();
        if (user) {
            return response.unauthorized("User already exists!", res);
        }
        value.password = encrypt(value.password);
        // Create user with all schema fields
        user = await models.customer.create(value);
        // Generate access token
        let token = generateAccessToken({ customerId: user._id, name: user.name, userType:"customer",customerType:user.customerType });

        return response.success('User registered successfully.',{ token }, res);
    } catch (error) {
        console.log(error);
        return response.error(error, res);
    }
}


exports.whoAmI = async (req, res) => {
    try {
      let distributorModel = models.customer;
      let userData = await distributorModel
        .findById(req.token.customerId)
        .select('name email isActive isDeleted mobile customerType')
        .lean();
      if (userData) {
        userData._id = userData?._id || userData?.id;
      }
      return response.success('User info!', userData, res);
    } catch (err) {
      return response.error(err, res);
    }
  };