/**
 * Test cases for the user injection middleware.
 */

const chai = require('chai');
const should = chai.should();

const argon = require('argon2');

const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const dbConfig = require('../../config/dbconfig');

const User = require('../../models/user');
const user = require('../../middlewares/user');

let testUser = null;

before(done => {
    mockgoose.prepareStorage().then(() => {
        mongoose.connect(dbConfig.testUrl, (err) => {
            done(err);
        })
    });
})

describe('User injection middleware', () => {
    beforeEach((done) => {
        mockgoose.helper.reset().then(() => {
            argon.hash('1234').then(hash => {
                const newUser = new User({
                    username: 'test',
                    password: hash,
                    email: 'test@test.com',
                    registeredAt: Date.now()
                });
                newUser.save((err) => {
                    testUser = newUser;

                    done(err);
                });                    
            });
        });
    });

    describe('With no user data', () => {
        it('user should be null', (done) => {
            const req = {
                session: {}
            };

            const next = () => {
                should.not.exist(req.user);
    
                done();
            };
            user(req, {}, next);
        });
    });

    describe('With not existing user', () => {
        it('user should be null', (done) => {
            const req = {
                session: {
                    user: -1
                }
            };

            const next = () => {
                should.not.exist(req.user);
    
                done();
            };
            user(req, {}, next);
        })
    });

    describe('With existing user', () => {
        it('user should be the testuser', (done) => {
            const req = {
                session: {
                    user: testUser._id
                }
            };

            const next = () => {
                req.user._id.should.be.eql(testUser._id);
    
                done();
            };
            user(req, {}, next);
        })
    })
});