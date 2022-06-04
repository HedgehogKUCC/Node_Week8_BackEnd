module.exports = (res, data, httpStatus = 200) => {
    res.status(httpStatus).json({
        result: true,
        data,
    });
}
