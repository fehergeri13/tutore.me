const express = require('express');
const app = express();

const dbconfig = require('./config/dbconfig');
const mongoose = require('mongoose');

//MongoDB connection
mongoose.connect(dbconfig.url, {
   useMongoClient: true 
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(require('./controllers'));

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000);