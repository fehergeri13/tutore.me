/**
 * Controller for rating handling.
 */
const _ = require('lodash');

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Rating = require('../models/rating');

const userMiddleware = require('../middlewares/user');
const authMiddleware = require('../middlewares/auth');

/**
 * GET: /rating/list/:userId
 * response: {[
 *  stars: number
 *  body: string
 *  userId: string
 *  username: string
 *  createdAt: date
 * ]}
 * 
 * Returns the ratings for the given user. Returns
 * 200 in case of success, 400 otherwise.
 */
router.get('/list/:userId', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params.userId) {
        res.status(400).end();
    } else {
        User.findById(req.params.userId, (err, user) => {
            if (err || !user) {
                res.status(400).end();
            } else {
                Rating.find({ target: user._id }).populate('ratedBy').exec((err, ratings) => {
                    if (err) {
                        res.status(400).end();
                    } else {
                        let result = [];

                        ratings.forEach((rating) => {
                            result.push({
                                stars: rating.start,
                                body: rating.body,
                                userId: rating.ratedBy._id,
                                username: rating.ratedBy.username,
                                createdAt: rating.createdAt
                            });
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
 * POST: /rating/
 * request: {
 *  targetId: string, required
 *  stars: number, required
 *  body: string, required
 * }
 * 
 * Creates a new rating of the given user.
 * Return 200 in case of success, 400 otherwise.
 */
router.post('/', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.body || !req.body.targetId ||
        !req.body.stars || !req.body.body) {
        res.status(400).end();
    } else if (req.user._id.toString() == req.body.targetId.toString()) {
        res.status(400).end();
    } else {
        User.findById(req.body.targetId, (err, user) => {
            if (err || !user) {
                res.status(400).end();
            } else {
                Rating.findOne({ ratedBy: req.user._id, target: req.body.targetId }, (err, rating) => {
                    if (err || rating) {
                        res.status(400).end();
                    } else {
                        const newRating = new Rating({
                            stars: req.body.stars,
                            body: req.body.body,
                            createdAt: new Date(),
                            ratedBy: req.user._id,
                            target: req.body.targetId
                        });

                        newRating.save((err) => {
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
    }
});

/**
 * PUT: /rating/:id
 * request: {
 *  stars: number
 *  body: string
 * }
 * 
 * Updates the given rating. Return 200
 * in case of success, 400 otherwise.
 */
router.put('/:id', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params.id || !req.body ||
        !req.body.stars && !req.body.body) {
        res.status(400).end();
    } else {
        Rating.findById(req.params.id, (err, rating) => {
            if (err || !rating) {
                res.status(400).end();
            } else {
                if (req.user._id.toString() == rating.target.toString()) {
                    res.status(400).end();
                } else if (rating.ratedBy.toString() != req.user._id.toString()) {
                    res.status(400).end();
                } else {
                    if (req.body.stars) {
                        rating.stars = req.body.stars;
                    }
                    if (req.body.body) {
                        rating.body = req.body.body;
                    }

                    rating.save((err) => {
                        if (err) {
                            res.status(400).end();
                        } else {
                            res.status(200).end();
                        }
                    });
                }
            }
        });
    }
});

/**
 * DELETE: /rating/:id
 * 
 * Deletes the given rating. Returns 200 in
 * case of success, 400 otherwise.
 */
router.delete('/:id', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params.id) {
        res.status(400).end();
    } else {
        Rating.findById(req.params.id, (err, rating) => {
            if (err || !rating) {
                res.status(400).end();
            } else if (rating.ratedBy.toString() != req.user._id.toString()) {
                res.status(400).end();
            } else {
                Rating.remove({ _id: req.params.id }, (err) => {
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