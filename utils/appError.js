module.exports = (errMessage, next, httpStatus = 400) => {
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error);
}
