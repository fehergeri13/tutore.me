const express = require('express');
const app = express();

const dbconfig = require('./config/dbconfig');
const mongoose = require('mongoose');

const sessions = require('client-sessions');

//MongoDB connection
mongoose.connect(dbconfig.url, {
   useMongoClient: true 
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//client-sessions setup
app.use(sessions({
    secret: 'FXh5ALpPawOBdFYe82M8n96J08PFgl1ufvVEVbFt',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

app.use(require('./controllers'));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => { console.log('Listening on port 3000...') });

//For testing
module.exports = app;