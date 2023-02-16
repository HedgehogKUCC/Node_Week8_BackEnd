const jwt = require('jsonwebtoken');

import success from '../services/responseSuccess';

module.exports = (user, res, httpStatus = 200) => {

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY,
    });

    user.password = undefined;

    success(res, { "user": {
            token,
            name: user.name,
        }
    },  httpStatus);
}
