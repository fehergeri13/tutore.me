const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient, ObjectId} = require('mongodb');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const axios = require("axios");
const moment = require("moment");

const renderEmailTemplate = require("./emailTemplate");

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        refreshToken: process.env.OAUTH2_REFRESH_TOKEN,
        accessToken: process.env.OAUTH2_ACCESS_TOKEN,
    },
});

const mongodb = {
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    database: process.env.MONGODB_DATABASE,
    collection: process.env.MONGODB_COLLECTION,
};

const mongodbUrl = `mongodb://${mongodb.username}:${mongodb.password}@${mongodb.host}:${mongodb.port}`;

app.get('/api/constants', (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.write(`const RE_CAPTCHA_SITE_KEY = "${process.env.RECAPTCHA_SITE_KEY}";`);
    res.end();
});

app.get('/api/hirdetes', async (req, res) => {
    const connection = await MongoClient.connect(mongodbUrl);
    const db = connection.db(mongodb.database);
    const collection = db.collection(mongodb.collection);

    const now = Date.now();
    const monthBefore = moment(now).subtract(1, 'months').valueOf();

    const cursor = collection.find(
        {
            confirmedByUser: true,
            confirmedByAdmin: true,
            timestamp: {"$gte": monthBefore}
        }, {
            projection: {
                title: 1,
                body: 1,
                timestamp: 1,
            }
        }
    );

    const items = await cursor.toArray();

    res.json(items);
});

app.post('/api/hirdetes', async (req, res) => {

    const now = Date.now();

    console.log("-----------------------");
    console.log("[INFO] Request received", moment(now).format("YYYY MMMM DD HH:mm"));

    await wait(1000);

    const {title, body, email, reCaptchaResponse} = req.body;

    console.log("[INFO] Validating reCaptcha");

    const validateResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${reCaptchaResponse}`,);

    if (validateResponse.data.success === false) {
        console.log("[ERROR] Failed reCaptcha validation: ", validateResponse.data);
        res.write("Failed");
        res.end();
        return;
    }

    console.log("[INFO] Validated reCaptcha");

    const connection = await MongoClient.connect(mongodbUrl);
    const db = connection.db(mongodb.database);
    const collection = db.collection(mongodb.collection);

    console.log("[INFO] Connected to MongoDB");

    const confirmUserToken = crypto.randomBytes(20).toString('hex');
    const confirmAdminToken = crypto.randomBytes(20).toString('hex');

    const {insertedId} = await collection.insertOne({
        title: title,
        body: body,
        timestamp: now,
        creator: email,
        confirmUserToken,
        confirmAdminToken,
        confirmedByUser: false,
        confirmedByAdmin: false,
    });

    console.log(`[INFO] Inserted to MongoDB: ${insertedId}`);

    const confirmLink = `http://tutore.me/api/confirm/user/${insertedId}/${confirmUserToken}`;

    await transporter.sendMail({
        from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: 'Megerősítő email - tutore.me',
        html: renderEmailTemplate(title, body, confirmLink)
    });

    console.log("[INFO] Confirm mail sent");

    res.write("Success");
    res.end();
});

app.get('/api/confirm/:type/:id/:token', async (req, res, next) => {

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    const now = Date.now();

    console.log("-----------------------");
    console.log("[INFO] Request received", moment(now).format("YYYY MMMM DD HH:mm"));

    await wait(1000);

    const {type, id, token} = req.params;

    console.log(`[INFO] Confirm args type: ${type} id: ${id} token: ${token}`);

    if (type !== "user" && type !== "admin") {
        console.log(`[ERROR] Invalid confirm type: ${type}`);
        res.write("Hibás kérés");
        res.end();
        return;
    }

    const connection = await MongoClient.connect(mongodbUrl);
    const db = connection.db("tutoreme");
    const collection = db.collection("hirdetes");

    console.log("[INFO] Connected to MongoDB");

    const hirdetes = await collection.findOne({_id: ObjectId(id)});

    if (hirdetes === null) {
        console.log(`[ERROR] Item not found by id: ${id}`);
        res.write("A hirdetés nem található.");
        res.end();
        return;
    }

    console.log(`[INFO] Item found: ${id}`);

    if (type === "user") {
        if (hirdetes.confirmedByUser === true) {
            console.log(`[INFO] Item is already confirmed by user.`);
            res.write("A hirdetés már meg lett erősítve. Ha én is jóváhagytam, akkor meg fog jelenni az oldalon a hirdetés. Ez kb 24 óra.");
            res.end();
            return;
        }
        if (hirdetes.confirmUserToken !== token) {
            console.log(`[ERROR] Item confirm token is invalid: expected: ${hirdetes.confirmUserToken}`);
            console.log(`                                         actual: ${token}`);
            res.write("Rossz a megerősítő kód.");
            res.end();
            return;
        }
    }

    if (type === "admin") {
        if (hirdetes.confirmedByAdmin === true) {
            console.log(`[INFO] Item is already confirmed by admin.`);
            res.write("A hirdetés már meg lett erősítve admin által.");
            res.end();
            return;
        }
        if (hirdetes.confirmAdminToken !== token) {
            console.log(`[ERROR] Item confirm token is invalid: expected: ${hirdetes.confirmAdminToken}`);
            console.log(`                                         actual: ${token}`);
            res.write("Rossz a megerősítő kód.");
            res.end();
            return;
        }
    }

    const updateOperation = type === "user" ?
        {"$set": {confirmedByUser: true}} :
        {"$set": {confirmedByAdmin: true}};

    await collection.findOneAndUpdate({_id: ObjectId(id)}, updateOperation);

    console.log("[INFO] MongoDB document updated");

    if (type === "user") {
        const confirmLink = `http://tutore.me/api/confirm/admin/${hirdetes._id}/${hirdetes.confirmAdminToken}`;

        await transporter.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ADDRESS}>`,
            to: process.env.ADMIN_EMAIL_ADDRESS,
            subject: 'Admin megerősítő email - tutore.me',
            html: renderEmailTemplate(hirdetes.title, hirdetes.body, confirmLink)
        });

        console.log("[INFO] Confirm mail sent");
    }

    res.write("Sikeres megerősítés");
    res.end();
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));

