import { Response, NextFunction } from 'express';
import { CustomError, AsyncFunction, CustomRequest } from '../types/index';

export default (func: AsyncFunction) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        func(req, res, next).catch((err: CustomError) => {
            next(err);
        })
    }
}
