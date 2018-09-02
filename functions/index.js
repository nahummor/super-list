// // https://firebase.google.com/docs/functions/write-firebase-functions

const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./serviceAccountKey.json');
const nodemailer = require('nodemailer');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://superlist-80690.firebaseio.com'
});

const fsDB = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    response.status(200).json({ message: 'Hello World from Firebase' });
  });
});
