import { NextFunction } from 'express';
import { ICustomError } from '../types/index';

export default (errMessage: string, next: NextFunction, httpStatus = 400) => {
    const error = new Error(errMessage) as ICustomError;
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
}
