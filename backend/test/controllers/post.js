/**
 * Test cases for post handling controller.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const argon = require('argon2');

const User = require('../../models/user');
const Post = require('../../models/post');

const server = require('../../app');

chai.use(chaiHttp); 

let testUser;
let testUser2;
let testPosts = [];

describe('Post handling controller', () => {
    beforeEach((done) => {
        mockgoose.helper.reset().then(() => {
            testPosts = [];

            //Test user
            argon.hash('1234').then((hash) => {
                testUser = new User({
                    username: 'test',
                    password: hash,
                    email: 'test@test.com',
                    registeredAt: Date.now(),
                    isAdmin: true
                });
                testUser.save((err) => {
                    if (err) {
                        done(err);
                    } else {
                        //First test post
                        let newTestPost = new Post({
                            name: 'Test post 1',
                            body: 'test test',
                            type: 'demand',
                            subject: 'Subject1',
                            createdAt: Date.now(),
                            expiresAt: Date.now() + 10000,
                            user: testUser._id
                        });
                        newTestPost.save((err) => {
                            if (err) {
                                done(err);
                            } else {
                                testPosts.push(newTestPost);

                                //Second test post
                                newTestPost = new Post({
                                    name: 'Test post 2',
                                    body: 'test test',
                                    type: 'demand',
                                    subject: 'Subject2',
                                    createdAt: Date.now(),
                                    expiresAt: Date.now() + 10000,
                                    user: testUser._id
                                });

                                newTestPost.save((err) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        testPosts.push(newTestPost);

                                        //Third test post
                                        newTestPost = new Post({
                                            name: 'Test post 3',
                                            body: 'test test',
                                            type: 'supply',
                                            subject: 'Subject1',
                                            createdAt: Date.now(),
                                            expiresAt: Date.now() + 10000,
                                            user: testUser._id
                                        });

                                        newTestPost.save((err) => {
                                            if (err) {
                                                done(err);
                                            } else {
                                                testPosts.push(newTestPost);

                                                //Fourth test post
                                                newTestPost = new Post({
                                                    name: 'Test post 4',
                                                    body: 'test test',
                                                    type: 'supply',
                                                    subject: 'Subject2',
                                                    createdAt: Date.now(),
                                                    expiresAt: Date.now() + 10000,
                                                    user: testUser._id
                                                });

                                                newTestPost.save((err) => {
                                                    if (err) {
                                                        done(err);
                                                    } else {
                                                        testPosts.push(newTestPost);

                                                        //Fifth test post
                                                        newTestPost = new Post({ 
                                                            name: 'Test post 5',
                                                            body: 'test test',
                                                            type: 'supply',
                                                            subject: 'Subject3',
                                                            createdAt: Date.now() - 200,
                                                            expiresAt: Date.now() - 100,
                                                            user: testUser._id
                                                        });

                                                        newTestPost.save((err) => {
                                                            if (err) {
                                                                done(err);
                                                            } else {
                                                                testPosts.push(newTestPost);
                                                                done();
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                });
                            };
                        })
                    }
                });
            });

            //Test user 2
            argon.hash('1234').then((hash) => {
                testUser2 = new User({
                    username: 'test2',
                    password: hash,
                    email: 'test@test.com',
                    registeredAt: Date.now()
                });
                testUser2.save((err) => {
                    if (err) {
                        done(err);
                    }
                });
            });
        });
    });

    describe('GET: /post/list/?query', () => {
        describe('List posts', () => {
            it('should return 200 and posts that are not expired', (done) => {
                chai.request(server)
                    .get('/post/list')
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        should.exist(res.body.posts);
                        res.body.posts.length.should.eql(4);

                        res.body.posts.forEach((post) => {
                            const currentDate = new Date();
                            const expiresAt = new Date(post.expiresAt);   
                            expiresAt.should.be.above(currentDate);
                        });

                        done();
                    });
            });
        });

        describe('Missing filter parameter', () => {
            it('should return 400 and not return any posts', (done) => {
                chai.request(server)
                    .get('/post/list/?' + JSON.stringify({
                        filters: [{
                            type: 'subject'
                        }, {
                            value: 'Subject1'
                        }]
                    }))
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);
                        res.body.should.be.empty;

                        done();
                    });
            });
        });

        describe('Wrong type parameter', () => {
            it('should return 400 and not return any posts', (done) => {
                chai.request(server)
                    .get('/post/list/?' + JSON.stringify({
                        filters: [{
                            type: 'none',
                            value: ''
                        }]
                    }))
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);
                        res.body.should.be.empty;

                        done();
                    });
            });
        });

        describe('Filter by one subject', () => {
            it('should return 200 and the posts with subject: Subject1', (done) => {
                chai.request(server)
                    .get('/post/list/?' + JSON.stringify({
                        filters: [{
                            type: 'subject',
                            value: 'Subject1'
                        }]
                    }))
                    .send()
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.body.should.not.be.empty;

                        res.body.posts.length.should.equal(2);
                        res.body.posts.forEach((post) => {
                            post.subject.should.equal('Subject1');
                        });

                        done();
                    });
            });
        });

        describe('Filter by one type', () => {
            it('should return 200 and the posts with type: demand', (done) => {
                chai.request(server)
                    .get('/post/list/?' + JSON.stringify({
                        filters: [{
                            type: 'type',
                            value: 'demand'
                        }]
                    }))
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.body.should.not.be.empty;

                        res.body.posts.length.should.equal(2);
                        res.body.posts.forEach((post) => {
                            post.type.should.equal('demand');
                        });

                        done();
                    });
            });
        });

        describe('Filter by type and subject', () => {
            it('should return 200 and the post with type: supply, and subject: Subject2', (done) => {
                chai.request(server)
                    .get('/post/list/?' + JSON.stringify({
                        filters: [
                            {
                                type: 'type',
                                value: 'supply'
                            },
                            {
                                type: 'subject',
                                value: 'Subject2'
                            }]
                    }))
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.body.should.not.be.empty;

                        res.body.posts.length.should.equal(1);
                        res.body.posts.forEach((post) => {
                            post.type.should.equal('supply');
                            post.subject.should.equal('Subject2');
                        });

                        done();
                    });
            });
        });

        describe('Filter by more subjects', () => {
            it('should return 200 and the posts with subject: Subject1 and Subject2', (done) => {
                chai.request(server)
                    .get('/post/list/?' + JSON.stringify({
                        filters: [
                            {
                                type: 'subject',
                                value: 'Subject1'
                            },
                            {
                                type: 'subject',
                                value: 'Subject2'
                            }]
                    }))
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.body.should.not.be.empty;
                        
                        res.body.posts.length.should.equal(4);
                        res.body.posts.forEach((post) => {
                            post.subject.should.satisfy((subject) => {
                                return subject == 'Subject1' || subject == 'Subject2';
                            });
                        });

                        done();
                    });
            });
        });
    });

    describe('GET: /:id', () => {
        describe('Missing parameter', () => {
            it('should return 404', (done) => {
                chai.request(server)
                    .get('/post/')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(404);

                        done();
                    });
            });
        });

        describe('Invalid post id', () => {
            it('should return 400 and no post', (done) => {
                chai.request(server)
                    .get('/post/123123123')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);
                        res.body.should.be.empty;

                        done();
                    });
            }); 
        });

        describe('Valid post id', () => {
            it('should return 200 and the requested post', (done) => {
                chai.request(server)    
                    .get('/post/' + testPosts[0]._id)
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);
                        res.body.should.not.be.empty;

                        res.body.id.should.equal('' + testPosts[0]._id);

                        done();
                    });
            })
        });
    });

    describe('POST: /post/', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .post('/post/')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Missing request body', () => {
            it('should return 400 and should not create the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.post('/post/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Post.find({}, (err, posts) => {
                                    posts.length.should.equal(5);

                                    done();
                                });
                            });
                    });
            });
        });

        describe('Invalid post type', () => {
            it('should return 400 and not create a new post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.post('/post/')
                            .send({
                                name: 'Test',
                                body: 'test',
                                type: 'none',
                                subject: 'Subject'
                            })  
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Post.find({}, (err, posts) => {
                                    posts.length.should.equal(5);

                                    done();
                                });
                            });
                    });
            });
        });

        describe('Create a new post', () => {
            it('should return 200 and  create a new post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.post('/post/')
                            .send({
                                name: 'Test',
                                body: 'test',
                                type: 'demand',
                                subject: 'Subject'
                            })  
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Post.findOne({name: 'Test'}, (err, post) => {
                                    should.exist(post);
                                    post.body.should.equal('test');
                                    post.type.should.equal('demand');
                                    post.subject.should.equal('Subject');
                                    post.user.toString().should.equal(testUser._id.toString());

                                    done();
                                });
                            });
                    });
            });
        });
    });

    describe('PUT: /post/:id', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .put('/post/123123')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Missing request parameter', () => {
            it('should return 404', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.put('/post/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(404);

                                done();
                            });
                    });
            });
        });

        describe('Not owner user', () => {
            it('should return 401', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test2', password: '1234' })
                    .then((res) => {
                        agent.put('/post/' + testPosts[0]._id)
                            .send({
                                name: 'Test2'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(401);

                                done();
                            });
                    });
            });
        });

        describe('Invalid post type', () => {
            it('should return 400 and not update the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.put('/post/' + testPosts[0]._id)
                            .send({
                                name: 'Test2',
                                type: 'none'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Post.findById(testPosts[0]._id, (err, post) => {
                                    post.name.should.equal(testPosts[0].name);
                                    post.type.should.equal(testPosts[0].type);
                                    done();
                                });
                            });
                    });
            });
        });

        describe('Update post', () => {
            it('should return 200 and update the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.put('/post/' + testPosts[0]._id)
                            .send({
                                name: 'Test2',
                                body: 'test2'
                            })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Post.findById(testPosts[0]._id, (err, post) => {
                                    post.name.should.equal('Test2');
                                    post.body.should.equal('test2');

                                    done();
                                });
                            });
                    });
            });
        });
    });

    describe('DELETE: /post/:id', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .delete('/post/123123')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Missing request parameter', () => {
            it('should return 404', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.delete('/post/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(404);

                                done();
                            });
                    });
            });
        });

        describe('Invalid post id', () => {
            it('should return 400', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.delete('/post/123123')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Not owner user', () => {
            it('should return 401 and not delete the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test2', password: '1234' })
                    .then((res) => {
                        agent.delete('/post/' + testPosts[0]._id)
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(401);

                                Post.findById(testPosts[0]._id, (err, post) => {
                                    should.exist(post);

                                    done();
                                })
                            });
                    });
            });
        });

        describe('Valid post id', () => {
            it('should return 200 and delete the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.delete('/post/' + testPosts[0]._id)
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Post.findById(testPosts[0]._id, (err, post) => {
                                    should.not.exist(post);

                                    done();
                                })
                            });
                    });
            });
        });
    });

    describe('POST: /post/extend', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .post('/post/extend')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Missing request body', () => {
            it('should return 400', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.post('/post/extend')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Invalid post id', () => {
            it('should return 400', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.post('/post/extend')
                            .send({ postId: '123123' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Not owner user', () => {
            it('should return 401 and not update the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test2', password: '1234' })
                    .then((res) => {
                        agent.post('/post/extend')
                            .send({ postId: testPosts[0]._id })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(401);

                                Post.findById(testPosts[0]._id, (err, post) => {
                                    post.expiresAt.toString().should.equal(testPosts[0].expiresAt.toString());

                                    done();
                                })
                            });
                    });
            });
        });

        describe('Extend the expiration date', () => {
            it('should return 200 and update the post', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test', password: '1234' })
                    .then((res) => {
                        agent.post('/post/extend')
                            .send({ postId: testPosts[0]._id })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Post.findById(testPosts[0]._id, (err, post) => {
                                    const oldDate = new Date(testPosts[0].expiresAt);
                                    const newDate = new Date(post.expiresAt);
                                    newDate.should.be.above(oldDate);

                                    done();
                                })
                            });
                    });
            });
        });
    });
});