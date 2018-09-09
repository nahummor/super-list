// // https://firebase.google.com/docs/functions/write-firebase-functions

const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./serviceAccountKey.json');
const nodemailer = require('nodemailer');

// ======= Configure Gmail ================================================
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});
const APP_NAME = 'Nahum App :) Welcome';
// ======= Email ===========================================================

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://superlist-80690.firebaseio.com'
});

const db = admin.firestore();

exports.deleteItem = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const listId = request.body.listId;
    const superList = request.body.superList;
    const deleteItemId = request.body.deleteItemId;

    const itemIndex = getItemIndex(deleteItemId, superList); // finde item index
    superList.items.splice(itemIndex, 1);

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('super-list')
          .doc(uid)
          .collection('user-list')
          .doc(listId)
          .update({ items: superList.items })
          .then(
            writeResult => {
              response.status(200).json({
                message: 'פריט נמחק בהצלחה',
                superList: superList,
                writeResult: writeResult
              });
            },
            error => {
              response.status(403).json({ errorMsg: error });
            }
          );
      })
      .catch(error => {
        response.status(403).json({ errorMsg: 'Unauthorized user' });
      });
  });
});

exports.deleteList = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const listId = request.body.listId;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('super-list')
          .doc(uid)
          .collection('user-list')
          .doc(listId)
          .delete()
          .then(
            writeResult => {
              response.status(200).json({
                message: 'רשימה חדשה נמחקה בהצלחה',
                listId: listId,
                writeResult: writeResult
              });
            },
            error => {
              response.status(403).json({ errorMsg: error });
            }
          );
      })
      .catch(error => {
        response.status(403).json({ errorMsg: 'Unauthorized user' });
      });
  });
});

exports.addNewSharedList = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const token = request.body.token;
    const name = request.body.name;
    const description = request.body.description;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('shared-list')
          .add({
            name: name,
            description: description,
            items: []
          })
          .then(docRef => {
            response.status(200).json({
              message: 'רשימה חדשה נקלטה בהצלחה',
              superList: {
                id: docRef.id,
                name: name,
                description: description,
                items: []
              }
            });
          });
      });
  });
});

exports.addNewList = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const name = request.body.name;
    const description = request.body.description;
    const firstList = request.body.firstList;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        // add new list
        db.collection('super-list')
          .doc(uid)
          .collection('user-list')
          .add({ name: name, description: description, items: [] })
          .then(docRef => {
            if (firstList) {
              db.collection('super-list')
                .doc(uid)
                .collection('item-update')
                .add({ itemName: '', listName: '' });
            }
            response.status(200).json({
              message: 'רשימה חדשה נקלטה בהצלחה',
              superList: {
                id: docRef.id,
                name: name,
                description: description,
                items: []
              }
            });
          });
      })
      .catch(error => {
        response.status(403).json({ errorMsg: 'Unauthorized user' });
      });
  });
});

exports.addItem = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    let uid = request.body.uid;
    let superList = request.body.superList;
    let newItem = request.body.newItem;
    let token = request.body.token;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        newItem.id = superList.items.length;
        superList.items.push(newItem);

        db.collection('super-list')
          .doc(uid)
          .collection('user-list', ref => {
            return ref.where('name', '==', superList.name);
          })
          .doc(superList.id)
          .update({ items: superList.items })
          .then(
            () => {
              response.status(200).json({
                message: 'פריט חדש נקלט בהצלחה',
                superList: superList
              });
            },
            error => {
              response.status(401).json({
                title: 'Error',
                message: 'Error Add new Item',
                error: error
              });
            }
          );
      })
      .catch(error => {
        response.status(403).json({ errorMsg: 'Unauthorized user' });
      });
  });
});

// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate(user => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  return sendWelcomeEmail(email, displayName);
});

// [START onDeleteTrigger]
exports.sendDeleteUserEmail = functions.auth.user().onDelete(user => {
  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyeEmail(email, displayName);
});

// Sends a welcome email to the given user.
function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName ||
    ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to:', email);
  });
}

function sendGoodbyeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName ||
    ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Account deletion confirmation email sent to:', email);
  });
}

function getItemIndex(itemId, superList) {
  const itemIndex = superList.items.findIndex(item => {
    return item.id === itemId;
  });
  return itemIndex;
}
