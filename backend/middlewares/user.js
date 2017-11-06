/**
 * Middleware for injecting the current, previously authenticated user 
 * in the request.
 */

const User = require('../models/user');

module.exports = function(req, res, next) {
    if (req.session && req.session.user) {
        User.findById(req.session.user, (err, user) => {
            if (user) {
                req.user = user;
            } else {
                delete req.user;
                delete req.session.user;
            }

            next();
        });
    } else {
        next();
    }
}