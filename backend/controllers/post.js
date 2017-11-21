/**
 * Controller for post handling.
 */

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');

const userMiddleware = require('../middlewares/user');
const authMiddleware = require('../middlewares/auth');

/**
 * GET: /post/list/?query
 * query: {
 *  filters: [{
 *   type: enum, [subject, type], required
 *   value: string, required
 *  }]
 * }
 * response: {
 *  posts: [{
 *   id: string
 *   name: string
 *   body: string
 *   type: enum, [demand, supply]
 *   subject: string
 *   userId: string
 *   username: string
 *   createdAt: date
 *   expiresAt: date
 *  }]
 * }
 * 
 * Lists all available posts with the given filters.
 */
router.get('/list', (req, res, next) => {
    const currentDate = new Date();
    const subjectFilters = [];
    const typeFilters = [];
    let missingParams = false;

    if (req.jsonq && req.jsonq.filters) {
        req.jsonq.filters.forEach((filter) => {
            if (!filter.type || !filter.value) {
                res.status(400).end();
                missingParams = true;
            }
            else if (filter.type != 'subject' && filter.type != 'type') {
                res.status(400).end();
                missingParams = true;
            }
            else if (filter.type == 'subject') {
                subjectFilters.push(filter.value);
            }
            else if (filter.type == 'type') {
                typeFilters.push(filter.value);
            }
        });
    }
    
    if (!missingParams) {
        const query = {};
        if (subjectFilters.length > 0) {
            query.subject = { $in: subjectFilters };
        }
        if (typeFilters.length > 0) {
            query.type = { $in: typeFilters };
        }

        Post.find(query).populate('user').exec((err, posts) => {
            if (err) {
                res.status(400).end();
            } else {
                const result = [];
                posts.forEach((post) => {
                    const expiresAt = new Date(post.expiresAt);
                    if (currentDate < expiresAt) {
                        result.push({
                            id: post._id,
                            name: post.name,
                            body: post.body,
                            type: post.type,
                            subject: post.subject,
                            userId: post.user._id,
                            username: post.user.username,
                            createdAt: post.createdAt,
                            expiresAt: post.expiresAt
                        });
                    }
                });

                res.send({ posts: result });
            }
        });
    }
});

/**
 * GET: /post/:id
 * response: {
 *  id: string
 *  name: string
 *  body: string
 *  type: enum, [demand, supply]
 *  subject: string
 *  userId: string
 *  username: string
 *  createdAt: date
 *  expiresAt: date
 * }
 * 
 * Returns the post with the given id or 400 in case of
 * any error.
 */
router.get('/:id', (req, res, next) => {
    if (!req.params.id) {
        res.status(400).end();
    } else {
        Post.findById(req.params.id).populate('user').exec((err, post) => {
            if (err || !post) {
                res.status(400).end();
            } else {
                res.send({
                    id: post._id,
                    name: post.name,
                    body: post.body,
                    type: post.type,
                    subject: post.subject,
                    userId: post.user._id,
                    username: post.user.username,
                    createdAt: post.createdAt,
                    expiresAt: post.expiresAt
                });
            }
        });
    }
});

/**
 * POST: /post/extend
 * request: {
 *  postId: string, required
 * }
 * 
 * Extends the expiration date of the given post.
 * Return 200 in case of success, 400 otherwise.
 */
router.post('/extend', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.body || !req.body.postId) {
        res.status(400).end();
    } else {
        Post.findById(req.body.postId, (err, post) => {
            if (err || !post) {
                res.status(400).end();
            } else {
                if (post.user.toString() != req.user._id.toString()) {
                    res.status(401).end();
                } else {
                    const currentDate = new Date();
                    const expirationDate = new Date(post.expiresAt);

                    expirationDate.setMonth(currentDate.getMonth() + 1);
                    post.expiresAt = expirationDate;

                    post.save((err) => {
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
 * POST: /post/
 * request: {
 *  name: string, required
 *  body: string, required
 *  type: enum, [demand, supply], required
 *  subject: string, required
 * }
 * 
 * Creates a new post for the logged in user. Returns
 * 200 in case of success, 400 otherwise.
 */
router.post('/', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.body || !req.body.name || !req.body.body ||
        !req.body.type || !req.body.subject) {
        res.status(400).end();
    } else {
        const currentDate = new Date();
        const expirationDate = new Date();
        expirationDate.setMonth(currentDate.getMonth() + 1);

        const newPost = new Post({
            name: req.body.name,
            body: req.body.body,
            type: req.body.type,
            subject: req.body.subject,
            createdAt: currentDate,
            expiresAt: expirationDate,
            user: req.user._id
        });

        newPost.save((err) => {
            if (err) {
                res.status(400).end();
            } else {
                res.status(200).end();
            }
        });
    }
});

/**
 * PUT: /post/:id
 * request: {
 *  name: string, required
 *  body: string, required
 *  type: enum, [demand, supply], required
 *  subject: string, required
 * }
 * 
 * Updates the given post. Returns 200 in
 * case of success, 400 otherwise.
 */
router.put('/:id', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params.id) {
        res.status(400).end();
    } else {
        Post.findById(req.params.id, (err, post) => {
            if (err || !post) {
                res.status(400).end();
            } else if (post.user.toString() != req.user._id.toString()) {
                res.status(401).end();
            }
            else {
                if (req.body.name) {
                    post.name = req.body.name;
                }
                if (req.body.body) {
                    post.body = req.body.body;
                }
                if (req.body.type) {
                    post.type = req.body.type;
                }
                if (req.body.subject) {
                    post.subject = req.body.subject;
                }

                post.save((err) => {
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

/**
 * DELETE: /post/:id
 * 
 * Deletes the given post. Returns 200 in
 * case of success, 400 otherwise.
 */
router.delete('/:id', userMiddleware, authMiddleware, (req, res, next) => {
    if (!req.params.id) {
        res.status(400).end();
    } else {
        Post.findById(req.params.id, (err, post) => {
            if (err || !post) {
                res.status(400).end();
            } else {
                if (post.user.toString() != req.user._id.toString()) {
                    res.status(401).end();
                } else {
                    Post.remove({_id: post._id}, (err) => {
                        if (err) {
                            res.status(400).end();
                        } else {
                            res.status(200).end();
                        }
                    });
                }
            }
        })
    }
});

module.exports = router;