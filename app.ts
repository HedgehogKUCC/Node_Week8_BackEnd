import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from "swagger-ui-express";
// @ts-ignore
import swaggerFile from "./swagger_output.json";

import indexRouters from './routes/index';

import { ICustomError } from './types/index';

const app: Application = express();
import './connections/mongoDB';

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

process.on('uncaughtException', err => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('Uncaughted Exception！')
    console.error(err);
    process.exit(1);
});

/**
 * Swagger-Autogen properties-inheritance
 * https://github.com/davibaltar/swagger-autogen#properties-inheritance
 */
app.use('/api',
    /*
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.responses[400] = {
            description: '一般錯誤訊息',
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/ResponseErrorMsg' }
                }
            }
        }
        #swagger.responses[401] = {
            description: 'token 無效',
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/ResponseInvalidToken' }
                }
            }
        }
        #swagger.responses[404] = {
            description: '無此路由',
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/ResponseNotFoundPage' }
                }
            }
        }
        #swagger.responses[500] = {
            description: '重大錯誤，請後端查 log',
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/ResponseServerErrorMsg' }
                }
            }
        }
        #swagger.responses[504] = {
            description: '伺服器繁忙中，請稍後在操作'
        }
    */
indexRouters);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('無此路由') as ICustomError;
    error.statusCode = 404;
    error.isOperational = true;
    next(error);
});

const resErrorProd = (err: ICustomError, res: Response) => {
    if ( err.isOperational ) {
        if ( err.columns ) {
            return res.status(err.statusCode).send({
                result: false,
                msg: err.message,
                columns: err.errors,
            });
        }
        return res.status(err.statusCode).send({
            result: false,
            msg: err.message,
        });
    }
    console.log('重大錯誤 => ', err);

    /**
     * Vercel
     * https://vercel.com/guides/using-express-with-vercel#standalone-express
     * 
     * Notice that we added a setHeader line for our Cache-Control. This describes the lifetime of our resource, telling the CDN to serve from the cache and update in the background (at most once per second).
     */
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');

    res.status(err.statusCode).send({
        result: false,
        msg: '系統錯誤，請洽系統管理員',
    });
}

const resErrorDev = (err: ICustomError, res: Response) => {
    res.status(err.statusCode).send({
        result: false,
        name: err.name,
        message: err.message,
        stack: err.stack,
        error: err,
    });
}

app.use((err: ICustomError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;

    if ( err.message.indexOf('圖片檔案格式') !== -1 ) {
        err.statusCode = 400;
        err.isOperational = true;
    }

    if ( process.env.NODE_ENV === 'development' ) {
        return resErrorDev(err, res);
    }

    if ( err.name === 'ValidationError' ) {
        err.statusCode = 400;
        err.columns = err.errors;
        err.isOperational = true;
        return resErrorProd(err, res);
    }

    if ( err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' ) {
        err.message = '請重新登入帳號';
        err.statusCode = 401;
        err.isOperational = true;
        return resErrorProd(err, res);
    }

    if ( err.name === 'MulterError' ) {
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
    }

    if ( err.name === 'TypeError' ) {
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
    }

    if ( err.name === 'CastError' ) {
        err.message = '傳入的值與伺服器定義型別有誤';
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
    }

    if ( err.name === 'SyntaxError' ) {
        err.message = err.message;
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
    }

    resErrorProd(err, res);
});

process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise);
    console.error('unhandledRejection 原因：', err);
});

export default app;
