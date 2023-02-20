import jwt from 'jsonwebtoken';

import UserModel from '../models/User';

import handleErrorAsync from '../utils/handleErrorAsync';
import appError from '../services/appError';

export default handleErrorAsync(async (req, res, next) => {
    let token: string | undefined = undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if ( !token ) {
        return appError('請登入帳號', next, 401);
    }

    const decodeJWT = await new Promise((resolve, reject) => {
        jwt.verify(token!, process.env.JWT_SECRET!, (err, payload) => {
            if ( err ) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    }) as string | jwt.JwtPayload | undefined;

    if ( typeof decodeJWT === 'undefined' || typeof decodeJWT === 'string' ) {
        return  appError('請登入帳號', next, 401);
    }

    req.user = await UserModel.findById(decodeJWT.id);
    if ( !req.user ) {
        return  appError('請登入帳號', next, 401);
    }

    next();
});
