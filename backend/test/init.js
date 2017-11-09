const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const dbConfig = require('../config/dbconfig');

const server = require('../app');

before(done => {
    mockgoose.prepareStorage().then(() => {
        mongoose.connection.close(() => {
            mongoose.connect(dbConfig.testUrl, (err) => {
                done(err);
            });
        });
    });
});

after(() => {
    mongoose.connection.close();
    process.exit();
});