"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (res, data, httpStatus = 200) => {
    /**
     * Vercel
     * https://vercel.com/guides/using-express-with-vercel#standalone-express
     *
     * Notice that we added a setHeader line for our Cache-Control. This describes the lifetime of our resource, telling the CDN to serve from the cache and update in the background (at most once per second).
     */
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.status(httpStatus).json({
        result: true,
        data,
    });
};
