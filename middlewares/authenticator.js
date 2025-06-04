let jwt = require('jsonwebtoken');
let response = require("../utils/response");
let models = require("../models/zindex");
const { encrypt , decrypt } = require('../utils/encryptor');
exports.generateAccessToken = (userData) => {
  let token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN_DAYS}d`
  });
  return encrypt(token);
};


const isAdmin = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    let token = bearer[1];
    if (Boolean(token)) {
      try {
        token = decrypt(token);
      } catch (err) {
        return response.unauthorized(res);
      }
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, auth) => {
      if (err) {
        return response.unauthorized(res);
      } else {
        try {
          models.admin
        .findById(auth.id)
        .lean()
        .then((result) => {
          if (result.isActive) {
            req.token = auth;
            next();
          } else {
            return response.unauthorized(res);
          }
        })
        .catch((err) => {
          return response.unauthorized(res);
        });
        } catch (err) {
          return response.unauthorized(res);
        }
      }
    });
  } else {
    return response.unauthorized(res);
  }
};


exports.isRider = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.unauthorized(res);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return response.forbidden("Invalid token!", res);
    } else {
      //Check for condition, if the user is active or not
      models.rider 
        .findById(user.id)
        .lean()
        .then((result) => {
          if (result.isActive) {
            req.token = user;
            next();
          } else {
            return response.unauthorized(res);
          }
        })
        .catch((err) => {
          return response.unauthorized(res);
        });
    }
  });
};

exports.isCustomer = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.unauthorized(res);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return response.forbidden("Invalid token!", res);
    } else {
      //Check for condition, if the user is active or not
      models.customer 
        .findById(user.id)
        .lean()
        .then((result) => {
          if (result.isActive) {
            req.token = user;
            next();
          } else {
            return response.unauthorized(res);
          }
        })
        .catch((err) => {
          return response.unauthorized(res);
        });
    }
  });
};