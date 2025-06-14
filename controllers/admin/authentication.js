let response = require('./../../utils/response');
let models = require('./../../models/zindex');
let { generateAccessToken } = require('./../../middlewares/authenticator');
const { encrypt , decrypt } = require('../../utils/encryptor');

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return response.badRequest("Invalid request!", res);
        }
        let user = await models.admin.findOne({ email }).lean();
        if (!user) {
            return response.unauthorized("Invalid credentials!", res);
        }
        let isMatch = decrypt(user.password) === password;
        if (!isMatch) {
            return response.unauthorized("Invalid credentials!", res);
        }
        let token = generateAccessToken({ adminId: user._id ,name:user.name,userType:'admin'});
        return response.success('Login successfully.',{ token }, res);
    } catch (error) {
        console.log(error);
        return response.error(error, res);
    }
}

exports.register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return response.badRequest("Invalid request!", res);
        }
        let user = await models.admin.findOne({ email });
        if (user) {
            return response.unauthorized("User already exists!", res);
        }
        let data = { name, email,password:encrypt(password)  };
        user = await models.admin.create(data);
        let token = generateAccessToken({ adminId: user._id ,name:user.name,userType:'admin'});
        return response.success('User registered successfully.',{ token }, res);
    } catch (error) {
        console.log(error);
        return response.error(error, res);
    }
}