import { Response } from 'express';
import { IUser } from '../types/index';

import jwt from 'jsonwebtoken';

import success from '../services/responseSuccess';

export default (user: IUser, res: Response, httpStatus = 200) => {

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_DAY!,
    });

    user.password = undefined;

    success(res, { "user": {
            token,
            name: user.name,
        }
    },  httpStatus);
}
