export default function errorHandler(err, req, res, next) {
    if (!err.message) {
        res.status(500);
    } else {
        res.status(400);
    }

    res.send({
        error: err,
        message: err.message || 'Error: Internal Server Error',
    });
}
