/**
 * Controller for report handling.
 */
const _ = require('lodash');

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Report = require('../models/report');
const Post = require('../models/post');
const Rating = require('../models/rating');

const userMiddleware = require('../middlewares/user');
const authMiddleware = require('../middlewares/auth');

/**
 * GET: /report/list
 * response: {
 *  type: enum, [post, rating]
 *  comment: string
 *  postId: string, optional
 *  ratingId: string, optional
 *  reportedById: string
 *  reportedId: string
 *  createdAt: date
 * }
 * 
 * Lists the reports, only for admin users.
 */
router.get('/list', userMiddleware, authMiddleware, async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(401).end();
    } else {
        const reports = await Report.find({}).populate('post').populate('rating');
        const result = [];

        reports.forEach((report) => {
            const r = {
                type: report.type,
                comment: report.comment,
                reportedById: report.reportedBy,
                createdAt: report.createdAt
            };
            
            if (report.type == 'post') {
                r.postId = report.post._id;
                r.reportedId = report.post.user;
            } else {
                r.ratingId = report.rating._id;
                r.reportedId = report.rating.ratedBy;
            }

            result.push(r);
        });

        res.send(result);
    }
});

/**
 * POST: /report/
 * request: {
 *  type: enum, [post, rating], required
 *  comment: string, required
 *  postId: string
 *  ratingId: string
 * }
 * 
 * Creates a new report. Returns 200 in case of success,
 * 400 otherwise.
 */
router.post('/', userMiddleware, authMiddleware, async (req, res, next) => {
    if (!req.body.type || !req.body.comment ||
        (!req.body.postId && !req.body.ratingId)) {
        res.status(400).end();
    } else {
        if (req.body.type != 'post' && req.body.type != 'rating') {
            res.status(400).end();
        } else {
            if (req.body.type == 'post') {
                try {
                    const post = await Post.findById(req.body.postId);

                    if (!post) {
                        res.status(400).end();
                    } else {
                        const report = new Report({
                            type: 'post',
                            comment: req.body.comment,
                            post: post._id,
                            reportedBy: req.user._id,
                            createdAt: new Date()
                        });

                        await report.save();

                        res.status(200).end();
                    }
                } catch (err) {
                    res.status(400).end();     
                }
            } else { 
                try {
                    const rating = await Rating.findById(req.body.ratingId);
                    if (!rating) {
                        res.status(400).end();
                    } else {
                        const report = new Report({
                            type: 'rating',
                            comment: req.body.comment,
                            rating: rating._id,
                            reportedBy: req.user._id,
                            createdAt: new Date()
                        });

                        await report.save();

                        res.status(200).end();
                    }
                } catch (err) {
                    res.status(400).end();
                }
            }
        }
    }
});

/**
 * DELETE: /report/:id
 * 
 * Deletes the given report, only for admin user.
 */
router.delete('/:id', userMiddleware, authMiddleware, async (req, res, next) => {
    if (!req.user.isAdmin) {
        res.status(401).end();
    } else if (!req.params.id) {
        res.status(400).end();
    } else {
        try {
            const report = await Report.findById(req.params.id);
            if (!report) {
                res.status(400).end();
            } else {
                await Report.remove({ _id: req.params.id });
                res.status(200).end();
            }
        } catch (err) {
            res.status(400).end();
        }
    }
});

module.exports = router;