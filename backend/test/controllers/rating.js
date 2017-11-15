/**
 * Test cases for rating handling controller.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const argon = require('argon2');

const User = require('../../models/user');
const Rating = require('../../models/rating');

const server = require('../../app');
const user = require('../../controllers/user');

chai.use(chaiHttp); 

let testUsers = [];
let testRatings = [];

describe('Rating handling controller', () => {
    beforeEach((done) => {
        mockgoose.helper.reset().then(() => {
            testUsers = [];
            testRatings = [];

            //Test user 1
            argon.hash('1234').then((hash) => {
                let newTestUser = new User({
                    username: 'test1',
                    password: hash,
                    email: 'test@test.com',
                    registeredAt: Date.now()
                });
                newTestUser.save((err) => {
                    if (err) {
                        done(err);
                    } else {
                        testUsers.push(newTestUser);

                        //Test user 2
                        newTestUser = new User({
                            username: 'test2',
                            password: hash,
                            email: 'test@test.com',
                            registeredAt: Date.now()
                        });
                        newTestUser.save((err) => {
                            if (err) {
                                done(err);
                            } else {
                                testUsers.push(newTestUser);

                                //Test user 3
                                newTestUser = new User({
                                    username: 'test3',
                                    password: hash,
                                    email: 'test@test.com',
                                    registeredAt: Date.now()
                                });
                                newTestUser.save((err) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        testUsers.push(newTestUser);

                                        //Test rating 1
                                        let newTestRating = new Rating({
                                            stars: 3,
                                            body: 'test',
                                            ratedBy: testUsers[0]._id,
                                            target: testUsers[1]._id,
                                            createdAt: Date.now()
                                        });
                                        newTestRating.save((err) => {
                                            if (err) {
                                                done(err);
                                            } else {
                                                testRatings.push(newTestRating);

                                                //Test rating 2
                                                newTestRating = new Rating({
                                                    stars: 5,
                                                    body: 'test',
                                                    ratedBy: testUsers[2]._id,
                                                    target: testUsers[1]._id,
                                                    createdAt: Date.now()
                                                });
                                                newTestRating.save((err) => {
                                                    if (err) {
                                                        done(err);
                                                    } else {
                                                        testRatings.push(newTestRating);

                                                        //Test rating 3
                                                        newTestRating = new Rating({
                                                            stars: 1,
                                                            body: 'test',
                                                            ratedBy: testUsers[2]._id,
                                                            target: testUsers[0]._id,
                                                            createdAt: Date.now()
                                                        });
                                                        newTestRating.save((err) => {
                                                            if (err) {
                                                                done(err);
                                                            } else {
                                                                testRatings.push(newTestRating);

                                                                done();
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    });

    describe('GET: /rating/list', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .get('/rating/list')
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(401);

                    done();
                });
            });
        });

        describe('Missing request body', () => {
            it('should return 400 and no ratings', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/rating/list/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });

        describe('Invalid user id', () => {
            it('should return 400 and no ratings', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/rating/list/')
                            .send({ userId: '123123' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });

        describe('Empty response', () => {
            it('should return 200 and no ratings', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/rating/list/')
                            .send({ userId: testUsers[2]._id })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });

        describe('Rating list of user', () => {
            it('should return 200 and the ratings of the given user', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/rating/list/')
                            .send({ userId: testUsers[1]._id })
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

    describe('POST: /rating/', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .post('/rating/')
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(401);

                    done();
                });
            });
        });

        describe('Missing request body', () => {
            it('should return 400 and not create a new rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/rating/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.find({}, (err, ratings) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        ratings.length.should.be.equal(3);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Invalid target id', () => {
            it('should return 400 and not create a new rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/rating/')
                            .send({ 
                                targetId: '123123',
                                stars: 5,
                                body: 'test'
                             })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.find({}, (err, ratings) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        ratings.length.should.be.equal(3);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Invalid number of stars', () => {
            it('should return 400 and not create a new rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/rating/')
                            .send({ 
                                targetId: testUsers[2]._id,
                                stars: 6,
                                body: 'test'
                             })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.find({ target: testUsers[2]._id }, (err, ratings) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        ratings.should.be.empty;

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Existing rating', () => {
            it('should return 400 and not create a new rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/rating/')
                            .send({ 
                                targetId: testUsers[1]._id,
                                stars: 5,
                                body: 'test'
                             })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.find({ target: testUsers[1]._id }, (err, ratings) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        ratings.length.should.be.equal(2);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('User targeting itself', () => {
            it('should return 400 and not create a new rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/rating/')
                            .send({ 
                                targetId: testUsers[0]._id,
                                stars: 5,
                                body: 'test'
                             })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.find({ target: testUsers[0]._id }, (err, ratings) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        ratings.length.should.be.equal(1);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Create new rating', () => {
            it('should return 200 and create a new rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/rating/')
                            .send({ 
                                targetId: testUsers[2]._id,
                                stars: 5,
                                body: 'test'
                             })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);
                                
                                Rating.find({ target: testUsers[2]._id }, (err, ratings) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        ratings.length.should.be.equal(1);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });
    });

    describe('PUT: /rating/:id', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .put('/rating/' + testRatings[0]._id)
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
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/')
                            .send({ stars: 1, body: 'test test' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(404);

                                done();
                            });
                    });
            });
        });

        describe('Missing request body', () => {
            it('should return 400 and not update the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/' + testRatings[0]._id)
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        rating.stars.should.be.equal(testRatings[0].stars);
                                        rating.body.should.be.equal(testRatings[0].body);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Invalid request parameter', () => {
            it('should return 400', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/123123')
                            .send({ stars: 1, body: 'test test' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                done();
                            });
                    });
            });
        });

        describe('Invalid number of stars', () => {
            it('should return 400 and not update the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/' + testRatings[0]._id)
                            .send({ stars: 6 })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        rating.stars.should.be.equal(testRatings[0].stars);
                                        rating.body.should.be.equal(testRatings[0].body);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('User targeting itself', () => {
            it('should return 400 and not update the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test2', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/' + testRatings[0]._id)
                            .send({ stars: 1, body: 'test test' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        rating.stars.should.be.equal(testRatings[0].stars);
                                        rating.body.should.be.equal(testRatings[0].body);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Not owner user', () => {
            it('should return 400 and not update the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/' + testRatings[0]._id)
                            .send({ stars: 1, body: 'test test' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        rating.stars.should.be.equal(testRatings[0].stars);
                                        rating.body.should.be.equal(testRatings[0].body);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Update rating', () => {
            it('should return 200 and update the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.put('/rating/' + testRatings[0]._id)
                            .send({ stars: 1, body: 'test test' })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);
                                
                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        rating.stars.should.be.equal(1);
                                        rating.body.should.be.equal('test test');

                                        done();
                                    }
                                });
                            });
                    });
            });
        });
    });

    describe('DELETE: /rating/:id', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .delete('/rating/' + testRatings[0]._id)
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
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.delete('/rating/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(404);

                                done();
                            });
                    });
            });
        });

        describe('Invalid request parameter', () => {
            it('should return 400', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.delete('/rating/123123')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);
                                
                                done();
                            });
                    });
            });
        });

        describe('Not owner user', () => {
            it('should return 400 and not delete the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.delete('/rating/' + testRatings[0])
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        should.exist(rating);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Delete rating', () => {
            it('should return 200 and delete the rating', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.delete('/rating/' + testRatings[0]._id)
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);
                                
                                Rating.findById(testRatings[0]._id, (err, rating) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        should.not.exist(rating);

                                        done();
                                    }
                                });
                            });
                    });
            });
        });
    });
});