/**
 * Controller for user handling like login, registration and logout.
 */

const express = require('express');
const router = express.Router();

const argon = require('argon2');
const User = require('../models/user');

/**
 * /user/login: POST
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
        req.status(400).end();
    } else {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (user) {
                argon.verify(user.password, req.body.password)
                    .then(() => {
                        req.session.user = user._id;
                        user.lastLoginAt = Date.now();
                        user.save((err) => {
                            if (!err) {
                                res.status(200).end();
                            } else {
                                res.status(400).end();
                            }
                        })
                    })
                    .catch(() => {
                        res.status(401).end();
                    });
            } else {
                res.status(401).end();
            }
        });
    }
});

/**
 * /user/register: POST
 * request: {
 *  username: string, required
 *  password: string, required
 *  email: string, required
 *  firstname: string
 *  lastname: string
 * }
 * 
 * Registers the user with the given data. Returns 201 in case of success,
 * 400 otherwise.
 */
router.post('/register', (req, res, next) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.status(400).end();
    } else {
        const existingUser = User.findOne({ username: req.body.username }, (err, user) => {
            if (user) {
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
                            res.status(201).end();
                        }
                    });
                });
            }
        })
    }
});

/**
 * /user/logout: GET
 * 
 * Logs out the current user.
 */
router.get('/logout', (req, res, next) => {
    if (req.session && req.session.user) {
        delete req.session;
        delete req.session.user;

        res.status(200).end();
    } else {
        res.status(400).end();
    }
});

module.exports = router;