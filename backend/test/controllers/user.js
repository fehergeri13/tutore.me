/**
 * Test cases for the user handling controller.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const argon = require('argon2');

const User = require('../../models/user');

const server = require('../../app');
const user = require('../../controllers/user');

chai.use(chaiHttp); 

let testUsers = [];

describe('User handling controller', () => {
    beforeEach(done => {
        mockgoose.helper.reset().then(() => {
            testUsers = [];

            //First test user
            argon.hash('1234').then(hash => {
                const newUser = new User({
                    username: 'test1',
                    password: hash,
                    email: 'test@test.com',
                    registeredAt: Date.now(),
                    isAdmin: true
                });
                newUser.save((err) => {
                    testUsers.push(newUser);

                    if (err) {
                        done(err);
                    } else {
                        //Second test user
                        argon.hash('1234').then(hash => {
                            const newUser = new User({
                                username: 'test2',
                                password: hash,
                                email: 'test@test.com',
                                registeredAt: Date.now()
                            });
                            newUser.save((err) => {
                                testUsers.push(newUser);

                                if (err) {
                                    done(err);
                                } else {                                
                                    //Third test user
                                    argon.hash('1234').then(hash => {
                                        const newUser = new User({
                                            username: 'test3',
                                            password: hash,
                                            email: 'test@test.com',
                                            registeredAt: Date.now(),
                                            firstName: 'Test',
                                            lastName: 'Test',
                                            trustedUsers: [
                                                testUsers[0]._id,
                                                testUsers[1]._id
                                            ]
                                        });
                                        newUser.save((err) => {
                                            testUsers.push(newUser);

                                            done(err);
                                        });                    
                                    });
                                }
                            });                    
                        });
                    }
                });                    
            });
        });
    });

    describe('POST: /user/login', () => {
        describe('Missing request parameters', () => {
            it('should return 400 and no user id', done => {
                chai.request(server)
                    .post('/user/login')
                    .send({})
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);
                        res.body.should.be.empty;

                        done();
                    });
            });
        });

        describe('Non existing user', () => {
            it('should return 401 and no user id', done => {
                chai.request(server)
                    .post('/user/login')
                    .send({
                        username: 'test4',
                        password: '1234'
                    })
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);
                        res.body.should.be.empty;

                        done();
                    });
            });
        });

        describe('Existing user, wrong password', () => {
            it('should return 401 and no user id', done => {
                chai.request(server)
                    .post('/user/login')
                    .send({
                        username: 'test1',
                        password: '1233'
                    })
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);
                        res.body.should.be.empty;

                        done();
                    });
            });
        });

        describe('Existing user, correct password', () => {
            it('should return 200, user id and lastLoginAt should be updated', done => {
                chai.request(server)
                    .post('/user/login')
                    .send({
                        username: 'test1',
                        password: '1234'
                    })
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);

                        should.exist(res.body.userId);

                        User.findById(testUsers[0]._id, (err, user) => {
                            should.exist(user.lastLoginAt);
                            res.body.userId.should.be.equal(user._id.toString());

                            done(err);
                        });
                    });
            });
        });
    });

    describe('POST: /user/register', () => {
        describe('Missing username', () => {
            it('should return 400 and no new entry should be created', done => {
                chai.request(server)
                    .post('/user/register')
                    .send({
                        password: '1234',
                        email: 'asd@asd.com'
                    })
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);

                        User.find({}, (err, users) => {
                            users.length.should.equal(3);
                            done(err);
                        });
                    });
            });
        });

        describe('Missing password', () => {
            it ('should return 400 and no new entry should be created', done => {
                chai.request(server)
                    .post('/user/register')
                    .send({
                        username: 'test',
                        email: 'asd@asd.com'
                    })
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);

                        User.find({}, (err, users) => {
                            users.length.should.equal(3);
                            done(err);
                        });
                    });
            });
        });

        describe('Missing email', () => {
            it ('should return 400 and no new entry should be created', done => {
                chai.request(server)
                    .post('/user/register')
                    .send({
                        username: 'test',
                        password: '1234'
                    })
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);

                        User.find({}, (err, users) => {
                            users.length.should.equal(3);
                            done(err);
                        });
                    });
            });
        });

        describe('Existing username', () => {
            it ('should return 400 and no new entry should be created', done => {
                chai.request(server)
                    .post('/user/register')
                    .send({
                        username: 'test1',
                        password: '1234',
                        email: 'asd@asd.com'
                    })
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(400);

                        User.find({}, (err, users) => {
                            users.length.should.equal(3);
                            done(err);
                        });
                    });
            });
        });

        describe('Correct registration', () => {
            it ('should return 200 and a new user should be created', done => {
                chai.request(server)
                    .post('/user/register')
                    .send({
                        username: 'test',
                        password: '1234',
                        email: 'asd@asd.com'
                    })
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.equal(200);

                        User.findOne({ username: 'test' }, (err, user) => {
                            should.exist(user);
                            should.exist(user.registeredAt);
                            user.email.should.equal("asd@asd.com");

                            done(err);
                        });
                    });
            });
        });
    });

    describe('GET: /user/:id', () => {
        describe('Unauthorized access', () => {
            it('should return 401 without any body', done => {
                chai.request(server)
                    .get('/user/1')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);
                        res.body.should.be.empty;

                        done();
                    });
            });
        });

        describe('Not existing user id', () => {
            it('should return 400 without any body', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/user/123123')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);        
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });

        describe('Untrusted user', () => {
            it('should return 200 with only username and registeredAt', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/user/' + testUsers[1]._id)
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);      

                                should.not.exist(res.body.email);
                                should.not.exist(res.body.firstName);
                                should.not.exist(res.body.lastName);

                                res.body.username.should.equal(testUsers[1].username);
                                Date(res.body.registeredAt).should.equal(Date(testUsers[1].registeredAt));

                                done();
                            });
                    });
            });
        });

        describe('Trusted user', () => {
            it('should return 200 with all data', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/user/' + testUsers[2]._id)
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                res.body.username.should.equal(testUsers[2].username);
                                res.body.email.should.equal(testUsers[2].email);
                                res.body.firstName.should.equal(testUsers[2].firstName);
                                res.body.lastName.should.equal(testUsers[2].lastName);
                                Date(res.body.registeredAt).should.equal(Date(testUsers[2].registeredAt));

                                done();
                            });
                    });
            });
        });
    });

    describe('POST: /user/edit', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .post('/user/edit')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Editing', () => {
            it('should return 200 and the user data should be updated', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/edit')
                            .send({
                                email: 'test@test.com',
                                firstName: 'Test1',
                                lastName: 'Test2'
                            })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                User.findById(testUsers[0], (err, user) => {
                                    user.email.should.equal('test@test.com');
                                    user.firstName.should.equal('Test1');
                                    user.lastName.should.equal('Test2');

                                    done(err);
                                });
                            });
                    });
            });
        });
    });

    describe('POST: /user/changePassword', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .post('/user/changePassword')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Missing current password', () => {
            it('should return 400 and the password should not be changed', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/changePassword')
                            .send({
                                newPassword: '1235'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                User.findById(testUsers[0], (err, user) => {
                                    testUsers[0].password.should.eql(user.password);

                                    done(err);
                                });
                            });
                    });
            });
        });

        describe('Missing new password', () => {
            it('should return 400 and the password should not be changed', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/changePassword')
                            .send({
                                currentPassword: '1234'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                User.findById(testUsers[0], (err, user) => {
                                    testUsers[0].password.should.eql(user.password);

                                    done(err);
                                });
                            });
                    });
            });
        });

        describe('Wrong current password', () => {
            it('should return 400 and the password should not be changed', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/changePassword')
                            .send({
                                currentPassword: '1233',
                                newPassword: '1235'
                            })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                User.findById(testUsers[0], (err, user) => {
                                    testUsers[0].password.should.eql(user.password);

                                    done(err);
                                });
                            });
                    });
            });
        });

        describe('Password change', () => {
            it('should return 200 and the password should be changed', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/changePassword')
                            .send({
                                currentPassword: '1234',
                                newPassword: '1235'
                            })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                User.findById(testUsers[0], (err, user) => {
                                    argon.verify(user.password, '1235')
                                        .then(success => {
                                            success.should.equal(true);

                                            done();
                                        });
                                });
                            });
                    });
            });
        });
    });

    describe('POST: /user/addTrustedUser', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .post('/user/addTrustedUser')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Missing user id', () => {
            it('should return 400', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/addTrustedUser')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Not existing user id', () => {
            it('should return 400', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/addTrustedUser')
                            .send({ userId: '123123' })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                done();
                            });
                    });
            });
        });

        describe('Already trusted user', () => {
            it('should return 400 and add no user to trusted users', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test3', password: '1234' })
                    .then((res) => {
                        agent.post('/user/addTrustedUser')
                            .send({ userId: testUsers[0]._id })
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(400);

                                User.findById(testUsers[2], (err, user) => {
                                    user.trustedUsers.length.should.equal(2);

                                    done(err);
                                });                                
                            });
                    });
            });
        });

        describe('Trusted user adding', () => {
            it('should return 200 and add a user to trusted users', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.post('/user/addTrustedUser')
                            .send({ userId: testUsers[1]._id })
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                User.findById(testUsers[0], (err, user) => {
                                    user.trustedUsers.length.should.equal(1);
                                    should.equal(true, user.trustedUsers.indexOf(testUsers[1]._id) >= 0);

                                    done(err);
                                });                                
                            });
                    });
            });
        });
    });

    describe('GET: /user/logout', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .get('/user/logout')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Logout', () => {
            it('should return 200', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test2', password: '1234' })
                    .then((res) => {
                        agent.get('/user/logout')
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                done();
                            });
                    });
            });
        });
    });

    describe('GET: /user/list', () => {
        describe('Unauthorized access', () => {
            it('should return 401', done => {
                chai.request(server)
                    .get('/user/list')
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.equal(401);

                        done();
                    });
            });
        });

        describe('Non admin user', () => {
            it('should return 401', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test2', password: '1234' })
                    .then((res) => {
                        agent.get('/user/list')
                            .end((err, res) => {
                                should.exist(err);
                                res.status.should.equal(401);
                                res.body.should.be.empty;

                                done();
                            });
                    });
            });
        });

        describe('Admin user', () => {
            it('should return 200', done => {
                let agent = chai.request.agent(server);
                agent.post('/user/login')
                    .send({ username: 'test1', password: '1234' })
                    .then((res) => {
                        agent.get('/user/list')
                            .end((err, res) => {
                                should.not.exist(err);
                                res.status.should.equal(200);

                                res.body.users.should.not.be.empty;
                                res.body.users.length.should.equal(3);

                                done();
                            });
                    });
            });
        });
    });
});