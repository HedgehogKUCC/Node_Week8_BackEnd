import { Request, Response, NextFunction } from 'express';
import { CustomError, AsyncFunction } from '../types/index';

export default (func: AsyncFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch((err: CustomError) => {
            next(err);
        })
    }
}
