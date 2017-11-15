/**
 * Test cases for message handling controller.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const argon = require('argon2');

const User = require('../../models/user');
const Message = require('../../models/message');

const server = require('../../app');
const user = require('../../controllers/user');

chai.use(chaiHttp); 

let testUsers = [];
let testMessages = [];

describe('Message handling controller', () => {
    beforeEach((done) => {
        mockgoose.helper.reset().then(() => {
            testUsers = [];
            testMessages = [];

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

                                        //Test user 4
                                        newTestUser = new User({
                                            username: 'test4',
                                            password: hash,
                                            email: 'test@test.com',
                                            registeredAt: Date.now()
                                        });
                                        newTestUser.save((err) => {
                                            if (err) {
                                                done(err);
                                            } else {
                                                testUsers.push(newTestUser);

                                            //Test message 1
                                            let newTestMessage = new Message({
                                                from: testUsers[0]._id,
                                                to: testUsers[1]._id,
                                                message: 'test',
                                                createdAt: Date.now()
                                            });
                                            newTestMessage.save((err) => {
                                                if (err) {
                                                    done(err);
                                                } else {
                                                    //Test message 2
                                                    let newTestMessage = new Message({
                                                        from: testUsers[1]._id,
                                                        to: testUsers[0]._id,
                                                        message: 'test',
                                                        createdAt: Date.now() + 10
                                                    });
                                                    newTestMessage.save((err) => {
                                                        if (err) {
                                                            done(err);
                                                        } else {
                                                            newTestMessage.save((err) => {
                                                                if (err) {
                                                                    done(err);
                                                                } else {
                                                                    //Test message 3
                                                                    let newTestMessage = new Message({
                                                                        from: testUsers[0]._id,
                                                                        to: testUsers[2]._id,
                                                                        message: 'test',
                                                                        createdAt: Date.now() + 20
                                                                    });
                                                                    newTestMessage.save((err) => {
                                                                        if (err) {
                                                                            done(err);
                                                                        } else {
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
                            }
                        })
                    }
                });
            });
        });
    });

    describe('GET: /message/listUsers', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .get('/message/listUsers')
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(401);

                    done();
                });
            });
        });

        describe('List users with messages', () => {
            it('should return 200 and return the users with messages', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/message/listUsers/')
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                should.exist(res.body);
                                res.body.length.should.equal(2);

                                done();
                            });
                    });
            });
        });

        describe('Empty response', () => {
            it('should return 200 and no messages', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test4', password: '1234' })
                    .then((res) => {
                        agent.get('/message/listUsers/')
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                should.exist(res.body);
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });
    });

    describe('GET: /message/list', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .get('/message/list')
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.equal(401);

                    done();
                });
            });
        });

        describe('Missing request body', () => {
            it('should return 400 and no messages', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/message/list/')
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
            it('should return 400 and no messages', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/message/list/')
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

        describe('List messages', () => {
            it('should return 200 and the messages', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/message/list/')
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

        describe('Empty response', () => {
            it('should return 200 and not return any messages', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/message/list/')
                            .send({ userId: testUsers[3]._id })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });
    });

    describe('POST: /message/', () => {
        describe('Unauthorized access', () => {
            it('should return 401', (done) => {
                chai.request(server)
                .post('/message/')
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
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/message/')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Invalid user id', () => {
            it('should return 400 and not create a new message', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/message/')
                            .send({ to: '123123', message: 'test' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Message.find({}, (err, messages) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        messages.length.should.be.equal(3);
                                        
                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Message to himself', () => {
            it('should return 400 and not create a new message', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/message/')
                            .send({ to: testUsers[0]._id, message: 'test' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                Message.find({}, (err, messages) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        messages.length.should.be.equal(3);
                                        
                                        done();
                                    }
                                });
                            });
                    });
            });
        });

        describe('Message sending', () => {
            it('should return 200 and create a new message', (done) => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/message/')
                            .send({ to: testUsers[3]._id, message: 'test test' })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                Message.findOne({ from: testUsers[0]._id, to: testUsers[3]._id, message: 'test test' }, (err, message) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        should.exist(message);
                                        done();
                                    }
                                });
                            });
                    });
            })
        });
    });
});