/**
 * Test cases for report handling controller.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const argon = require('argon2');

const User = require('../../models/user');
const Report = require('../../models/report');
const Post = require('../../models/post');
const Rating = require('../../models/rating');

const server = require('../../app');
const user = require('../../controllers/user');

chai.use(chaiHttp);

let testUsers = [];
let testReports = [];
let testPost;
let testRating;

describe('Report handling controller', () => {
    beforeEach(async () => {
        testUsers = [];
        testReports = [];

        await mockgoose.helper.reset();
        //Test user 1
        let passwordHash = await argon.hash('1234');
        let newTestUser = new User({
            username: 'test1',
            password: passwordHash,
            email: 'test@test.com',
            registeredAt: Date.now()
        });
        try {
            await newTestUser.save();
        } catch (err) {
            return err;
        }

        testUsers.push(newTestUser);

        //Test user 2
        passwordHash = await argon.hash('1234');
        newTestUser = new User({
            username: 'test2',
            password: passwordHash,
            email: 'test@test.com',
            registeredAt: Date.now()
        });
        try {
            await newTestUser.save();
        } catch (err) {
            return err;
        }

        testUsers.push(newTestUser);

        //Test user 3
        passwordHash = await argon.hash('1234');
        newTestUser = new User({
            username: 'test3',
            password: passwordHash,
            email: 'test@test.com',
            isAdmin: true,
            registeredAt: Date.now()
        });
        try {
            await newTestUser.save();
        } catch (err) {
            return err;
        }

        testUsers.push(newTestUser);

        //Test post
        testPost = new Post({
            name: 'Test',
            body: 'test',
            type: 'demand',
            subject: 'Test',
            createdAt: Date.now(),
            expiresAt: Date.now() + 1,
            user: testUsers[0]._id
        });

        try {
            await testPost.save();
        } catch (err) {
            return err;
        }

        //Test rating
        testRating = new Rating({
            stars: 1,
            body: 'Test',
            createdAt: Date.now(),
            ratedBy: testUsers[0]._id,
            target: testUsers[1]._id
        });

        try {
            await testRating.save();
        } catch (err) {
            return err;
        }
        
        //Test report 1
        let newTestReport = new Report({
            type: 'post',
            post: testPost._id,
            comment: 'test',
            reportedBy: testUsers[1]._id,
            createdAt: Date.now()
        });
        try {
            await newTestReport.save();
        } catch (err) {
            return err;
        }

        testReports.push(newTestReport);

        //Test report 2
        newTestReport = new Report({
            type: 'rating',
            rating: testRating._id,
            comment: 'test',
            reportedBy: testUsers[1]._id,
            createdAt: Date.now()
        });
        try {
            await newTestReport.save();
        } catch (err) {
            return err;
        }

        testReports.push(newTestReport);
    });

    describe('GET: /report/list', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                    .get('/report/list')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                });
            });
        });

        describe('Non-admin user', () => {
            it('should return 401 and no reports', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/report/list/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(401);
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });

        describe('List reports', () => {
            it('should return 200 and two reports', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.get('/report/list/')
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                res.body.should.not.be.empty;
                                res.body.length.should.be.equal(2);

                                done();
                            });
                    });
            });
        });
    });

    describe('POST: /report/', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                    .post('/report/')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                });
            });
        });

        describe('Missing request body', () => {
            it('should return 400 and create no report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('Invalid type', () => {
            it('should return 400 and create no report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'user',
                                comment: 'test',
                                postId: testPost._id
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('Missing post id', () => {
            it('should return 400 and create no report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'post',
                                comment: 'test'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('Invalid post id', () => {
            it('should return 400 and create no report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'post',
                                comment: 'test',
                                postId: '123123'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('Missing rating id', () => {
            it('should return 400 and create no report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'rating',
                                comment: 'test'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('Invalid rating id', () => {
            it('should return 400 and create no report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'rating',
                                comment: 'test',
                                ratingId: '123123'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('New post report', () => {
            it('should return 200 and create a report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'post',
                                comment: 'test',
                                postId: testPost._id
                            })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(3);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });

        describe('New rating report', () => {
            it('should return 200 and create a report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/report/')
                            .send({
                                type: 'rating',
                                comment: 'test',
                                ratingId: testRating._id
                            })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(3);
                                        done();
                                    }
                                });                                
                            });
                    });
            });
        });
    }); 

    describe('DELETE: /report/:id', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                    .delete('/report/' + testReports[0]._id)
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                });
            });
        });

        describe('Non-admin user', () => {
            it('should return 401 and not delete the report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.delete('/report/' + testReports[0]._id)
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(401);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(2);
                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Missing request parameter', () => {
            it('should return 404', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.delete('/report/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(404);

                                done();
                            });
                    });
            });
        });

        describe('Invalid report id', () => {
            it('should return 404', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.delete('/report/123123')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Delete report', () => {
            it('should return 200 and delete the report', (done) => {
                const agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.delete('/report/' + testReports[0]._id)
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Report.find({}, (err, reports) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        reports.length.should.be.equal(1);
                                        done();
                                    }
                                });
                            });
                    });
            });
        });
    });
}); 