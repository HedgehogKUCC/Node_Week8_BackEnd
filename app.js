const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');

const app = express();
require('./connections/mongoDB');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', err => {
    // 記錄錯誤下來，等到服務都處理完後，停掉該 process
    console.error('Uncaughted Exception！')
    console.error(err);
    process.exit(1);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);

app.use((req, res, next) => {
    const error = new Error('無此路由');
    error.statusCode = 404;
    error.isOperational = true;
    next(error);
});

const resErrorProd = (err, res) => {
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
    res.status(err.statusCode).send({
        result: false,
        msg: '系統錯誤，請洽系統管理員',
    });
}

const resErrorDev = (err, res) => {
    res.status(err.statusCode).send({
        result: false,
        name: err.name,
        msg: err.message,
        stack: err.stack,
        error: err,
    });
}

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if ( err.message.indexOf('圖片檔案格式') !== -1 ) {
        err.statusCode = 400;
        err.isOperational = true;
    }

    if ( process.env.NODE_ENV === 'development' ) {
        return resErrorDev(err, res);
    }

    if ( err.name === 'ValidationError' ) {
        err.message = '資料欄位填寫有誤';
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

    resErrorProd(err, res);
});

process.on('unhandledRejection', (err, promise) => {
    console.error('未捕捉到的 rejection：', promise);
    console.error('unhandledRejection 原因：', err);
});

module.exports = app;
