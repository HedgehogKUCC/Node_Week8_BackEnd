import { NextFunction } from 'express';
import { CustomError } from '../types/index';

export default (errMessage: string, next: NextFunction, httpStatus = 400) => {
    const error = new Error(errMessage) as CustomError;
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
}
