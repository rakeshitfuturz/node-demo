let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let { generateAccessToken } = require('./../../middlewares/authenticator');
const { encrypt, decrypt } = require('./../../utilities/encryptor_util');

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return response.badRequest("Invalid request!", res);
        }
        let user = await models.customer.findOne({ email });
        if (!user) {
            return response.unauthorized("Invalid credentials!", res);
        }
        let isMatch = await user.isPasswordMatch(encrypt(password));
        if (!isMatch) {
            return response.unauthorized("Invalid credentials!", res);
        }
        let token = generateAccessToken({ id: user._id ,name:user.name,userType:'admin'});
        return response.success({ token }, res);
    } catch (error) {
        return response.error(error, res);
    }
}

exports.register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return response.badRequest("Invalid request!", res);
        }
        let user = await models.customer.findOne({ email });
        if (user) {
            return response.unauthorized("User already exists!", res);
        }
        user = await models.customer.create({ name, email,password:encrypt(password)  });
        let token = generateAccessToken({ id: user._id ,name:user.name,userType:'admin'});
        return response.success({ token }, res);
    } catch (error) {
        return response.error(error, res);
    }
}