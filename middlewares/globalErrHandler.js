const globalErrHandler = ((err, req, res, next) => {
        const stack = err.stack;
        const message = err.message;
        const status = err.status ? err.status : "failed";
        const statusCode = err.statusCode ? err.statusCode:500
        res.status(statusCode).json({
            status,
            message,
            stack
        })
    });

const notFoundErr = (req, res, next) => {
    const err = new Error(`Cant find ${req.originalUrl} on the server`);
    next(err);
}

module.exports = {globalErrHandler, notFoundErr};
