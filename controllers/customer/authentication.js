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
            userType: "customer"
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
            return response.badRequest(error.details[0].message, res);
        }

        // Check for existing user
        let user = await models.customer.findOne({ $or: [{ email: value.email }, { mobile: value.mobile }] });
        if (user) {
            return response.unauthorized("User already exists!", res);
        }
        value.password = encrypt(value.password);
        // Create user with all schema fields
        user = await models.customer.create(value);
        // Generate access token
        let token = generateAccessToken({ customerId: user._id, name: user.name, userType:"customer" });

        return response.success('User registered successfully.',{ token }, res);
    } catch (error) {
        console.log(error);
        return response.error(error, res);
    }
}