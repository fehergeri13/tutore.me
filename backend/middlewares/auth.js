/**
 * Middleware for authentication. Blocks requests that are
 * not by an authenticated user.
 */

module.exports = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).end();
    }
}