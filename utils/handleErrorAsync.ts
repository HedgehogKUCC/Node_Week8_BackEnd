import { Response, NextFunction } from 'express';
import { ICustomError, AsyncFunction, ICustomRequest } from '../types/index';

export default (func: AsyncFunction) => {
    return (req: ICustomRequest, res: Response, next: NextFunction) => {
        func(req, res, next).catch((err: ICustomError) => {
            next(err);
        })
    }
}
