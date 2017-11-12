/**
 * Controller for user handling.
 */

const express = require('express');
const router = express.Router();

const argon = require('argon2');
const User = require('../models/user');

const userMiddleware = require('../middlewares/user');
const authMiddleware = require('../middlewares/auth');

/**
 * GET: /user/list
 * response: {
 *  users: [{
 *   id: string
 *   username: string
 *   email: string
 *   registeredAt: string
 *   lastLoginAt: string, optional
 *  }]
 * }
 * 
 * Lists the registered users (admin function).
 */
router.get('/list', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.session.isAdmin) {
        res.status(401).end();
    } else {
        User.find({}, (err, users) => {
            if (err) {
                res.status(400).end();
            } else {
                const result = {
                    users: []
                };
    
                users.forEach((user) => {
                    result.users.push({
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        registeredAt: user.registeredAt,
                        lastLoginAt: user.lastLoginAt
                    });
                });

                res.send(result);
            }
        });
    }
});

/**
 * GET: /user/logout
 * 
 * Logs out the current user.
 */
router.get('/logout', userMiddleware, authMiddleware, (req, res, next) => {
    delete req.session;
    delete req.session.user;

    res.status(200).end();
});

/**
 * GET: /user/:id
 * response: {
 *  username: string
 *  registeredAt: date
 *  email: string, optional
 *  lastName: string, optional
 *  firstName: string, optional
 * }
 * 
 * Returns the user data for the given id.
 */
router.get('/:id', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params.id) {
        res.status(400).end();
    }

    User.findById(req.params.id, (err, user) => {
        if (err || !user) {
            res.status(400).end();
        } else {
            const response = {
                username: user.username,
                registeredAt: user.registeredAt
            };

            if ((user.trustedUsers && user.trustedUsers.indexOf(req.user._id) >= 0) ||
                user._id.toString() == req.user._id.toString()) {
                response.email = user.email;
                response.firstName = user.firstName;
                response.lastName = user.lastName;
            }

            res.send(response);
        }
    });
});

/**
 * POST: /user/login
 * request: {
 *  username: string, required
 *  password: string, required
 * }
 * 
 * Tries logging in the user with the credentials in the request.
 * Returns 200 if successful, 401 otherwise.
 */
router.post('/login', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).end();
    } else {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (user) {
                argon.verify(user.password, req.body.password)
                    .then((success) => {
                        if (!success) {
                            res.status(401).end();
                        } else {
                            req.session = {};
                            req.session.user = user._id;
                            if (user.isAdmin) {
                                req.session.isAdmin = true;
                            }
    
                            user.lastLoginAt = Date.now();
                            user.save((err) => {
                                if (!err) {
                                    res.status(200).end();
                                } else {
                                    res.status(400).end();
                                }
                            });
                        }
                    });
            } else {
                res.status(401).end();
            }
        });
    }
});

/**
 * POST: /user/register
 * request: {
 *  username: string, required
 *  password: string, required
 *  email: string, required
 *  firstName: string
 *  lastName: string
 * }
 * 
 * Registers the user with the given data.
 */
router.post('/register', (req, res, next) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.status(400).end();
    } else {
        const existingUser = User.findOne({ username: req.body.username }, (err, user) => {
            if (user || err) {
                res.status(400).end();
            } else {
                argon.hash(req.body.password).then(passwordHash => {
                    const newUser = new User({
                        username: req.body.username,
                        password: passwordHash,
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        registeredAt: Date.now()
                    });

                    newUser.save((err) => {
                        if (err) {
                            res.status(400).end();
                        } else {
                            res.status(200).end();
                        }
                    });
                });
            }
        })
    }
});

/**
 * POST: /user/edit
 * request: {
 *  email: string
 *  firstName: string
 *  lastName: string
 * }
 * 
 * Updates the non-null user data from the request.
 */
router.post('/edit', userMiddleware, authMiddleware, (req, res, next) => {
    if (req.body.email) {
        req.user.email = req.body.email;
    }
    if (req.body.firstName) {
        req.user.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
        req.user.lastName = req.body.lastName;
    }

    req.user.save((err) => {
        if (err) {
            res.status(400).end();
        } else {
            res.status(200).end();
        }
    });
});

/**
 * POST: /user/changePassword
 * request: {
 *  currentPassword: string, required
 *  newPassword: string, required
 * }
 * 
 * Changes the current user's password.
 */
router.post('/changePassword', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.body.currentPassword || !req.body.newPassword || 
        req.body.currentPassword == req.body.newPassword) {
        res.status(400).end();
    } else {
        User.findById(req.user._id, (err, user) => {
            if (!user || err) {
                res.status(400).end();
            } else {
                argon.verify(user.password, req.body.currentPassword)
                    .then((success) => {
                        if (!success) {
                            res.status(400).end();
                        } else {
                            argon.hash(req.body.newPassword)
                                .then((passwordHash) => {
                                    user.password = passwordHash;
                                    user.save((err) => {
                                        if (err) {
                                            res.status(400).end();
                                        } else {
                                            res.status(200).end();
                                        }
                                    });
                                });
                        }
                    })
            }
        });
    }
});

/**
 * POST: /user/addTrustedUser
 * request: {
 *  userId: string, required
 * }
 * 
 * Adds the user in the request to the current
 * user's trusted users.
 */
router.post('/addTrustedUser', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.body.userId) {
        res.status(400).end();
    } else {
        User.findById(req.body.userId, (err, user) => {
            if (!user || err) {
                res.status(400).end();
            } else {
                if (req.user.trustedUsers.indexOf(user._id) < 0) {
                    req.user.trustedUsers.push(user._id)
                    req.user.save((err) => {
                        if (err) {
                            res.status(400).end();
                        } else {
                            res.status(200).end();
                        }
                    })
                } else {
                    res.status(400).end();
                }
            }
        });
    }
});

module.exports = router;