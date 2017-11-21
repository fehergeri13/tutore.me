/**
 * Controller for message handling.
 */
const _ = require('lodash');

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Message = require('../models/message');

const userMiddleware = require('../middlewares/user');
const authMiddleware = require('../middlewares/auth');

/**
 * GET: /message/listUsers
 * response: [{
 *  user: {
 *   userId: string
 *   username: string
 *  }
 *  lastMessage: {
 *   message: string
 *   createdAt: date
 *   received: boolean
 *  }
 * }]
 * 
 * Lists the previously messaged users and the last message
 * from them.
 */
router.get('/listUsers', userMiddleware, authMiddleware, (req, res, next) => {
    Message.find({ $or: [{from: req.user._id}, {to: req.user._id}] }).populate('from').populate('to').exec((err, messages) => {
        if (err) {
            res.status(400).end();
        } else {
            if (messages.length == 0) {
                res.status(200).end();
            } else {
                const result = [];
                messages.forEach((message) => {
                    if (!_.find(result, (user) => { return user.user.userId.toString() == message.from._id.toString() }) &&
                        message.from._id.toString() != req.user._id.toString()) {
                        result.push({ user: { userId: message.from._id, username: message.from.username } });
                    } else if (!_.find(result, (user) => { return user.user.userId.toString() == message.to._id.toString() }) &&
                            message.to._id.toString() != req.user._id.toString()) {
                        result.push({ user: { userId: message.to._id, username: message.to.username } });
                    }
                });

                result.forEach((user) => {
                    const m = _.filter(messages, (message) => {
                        if (user.user.userId.toString() == message.from._id.toString() ||
                            user.user.userId.toString() == message.to._id.toString())
                            return true;

                        return false;
                    });

                    const message = _.maxBy(m, (o) => {
                        return new Date(o.createdAt);
                    });
                    
                    user.lastMessage = {
                        body: message.message,
                        createdAt: message.createdAt
                    };

                    if (message.from._id.toString() == user.user.userId.toString()) {
                        user.lastMessage.received = true;
                    } else {
                        user.lastMessage.received = false;
                    }
                });

                res.send(result);
            }
        }
    });
});

/**
 * GET: /message/list/:userId
 * request: {
 *  userId: string, required
 * }
 * response: [{
 *  message: string
 *  received: boolean
 *  createdAt: date
 * }]
 * 
 * Returns the messages sent to and received from the
 * user in the request body. Returns 200 in case of success,
 * 400 otherwise.
 */
router.get('/list/:userId', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params || !req.params.userId) {
        res.status(400).end();
    } else {
        User.findById(req.params.userId, (err, user) => {
            if (err || !user) {
                res.status(400).end();
            } else {
                Message.find({ $or: [{ $and: [{ from: req.user._id }, { to: user._id }]}, { $and: [{ from: user._id }, { to: req.user._id }]}] }, (err, messages) => {
                    if (err) {
                        res.status(400).end();
                    } else {
                        let result = [];
                        messages.forEach((message) => {
                            const r = {
                                message: message.message,
                                createdAt: message.createdAt
                            };

                            if (message.from.toString() == req.user._id.toString()) {
                                r.received = false;
                            } else {
                                r.received = true;
                            }

                            result.push(r);
                        });

                        result = _.orderBy(result, (o) => { return new Date(o.createdAt); });

                        res.send(result);
                    }
                });
            }
        });
    }
});

/**
 * POST: /message/
 * request: {
 *  to: string, required
 *  message: string, required
 * }
 * 
 * Creates a messages to the given user.
 * Return 200 in case of success, 400 otherwise.
 */
router.post('/', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.body || !req.body.to || !req.body.message) {
        res.status(400).end();
    } else if (req.user._id.toString() == req.body.to.toString()) {
        res.status(400).end();
    }
    else {
        User.findById(req.body.to, (err, user) => {
            if (err || !user) {
                res.status(400).end();
            } else {
                const message = new Message({
                    from: req.user._id,
                    to: user._id,
                    message: req.body.message,
                    createdAt: new Date()
                });

                message.save((err) => {
                    if (err) {
                        res.status(400).end();
                    } else {
                        res.status(200).end();
                    }
                });
            }
        });
    }
});

module.exports = router;