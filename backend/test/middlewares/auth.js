/**
 * Test cases for the authentication middleware.
 */

const chai = require('chai');
const should = chai.should();
const mAuth = require('../../middlewares/auth');

describe('Auth middleware', () => {
    describe('Without authenticated user', () => {
        it('it should return 401', (done) => {
            let res = {
                statusCode: 0,
                status: (val) => { 
                    res.statusCode = val;
                    return res;
                },
                end: () => { }
            };
            mAuth({}, res, null);
            res.statusCode.should.be.eql(401);
            done();
        });
    });

    describe('With authenticated user', () => {
        it('next() should be called', (done) => {
            let result = 0;
            const next = () => { result = 1 };
            
            mAuth({ user: {} }, null, next);
            result.should.be.eql(1);

            done();
        });
    });
})