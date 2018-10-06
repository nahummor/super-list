'use strict';

// // https://firebase.google.com/docs/functions/write-firebase-functions

const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./serviceAccountKey.json');
const nodemailer = require('nodemailer');
const fs = require('fs');
const UUID = require('uuid-v4');
const os = require('os');
const Busboy = require('busboy');
const path = require('path');

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

const gcconfig = {
  projectId: 'superlist-80690',
  keyFilename: 'serviceAccountKey.json'
};
const gcs = admin.storage();

const db = admin.firestore();
const msgIconPath =
  'https://firebasestorage.googleapis.com/v0/b/superlist-80690.appspot.com/o/superList.PNG?alt=media&token=d8adf246-198b-4602-af06-8efdc92807e5';

exports.sendMessageBySharedUser = functions.https.onRequest(
  (request, response) => {
    cors(request, response, () => {
      const userId = request.body.userId;
      const authorizedUserId = request.body.authorizedUserId;
      const token = request.body.token;
      const title = request.body.title;
      const message = request.body.message;

      const payload = {
        notification: {
          title: title,
          body: message,
          icon: msgIconPath
        }
      };

      admin
        .auth()
        .verifyIdToken(token)
        .then(decodedIdToken => {
          db.collection('shared-user')
            .where('userId', '==', userId)
            .where('authorizedUserId', '==', authorizedUserId)
            .get()
            .then(querySnapshot => {
              querySnapshot.docs.forEach(doc => {
                if (doc.data().sendToken) {
                  admin.messaging().sendToDevice(doc.data().userToken, payload);
                }
              });
            })
            .then(() => {
              response.status(200).json({
                message: 'הודעה נשלחה למשתמשים'
              });
            })
            .catch(error => {
              response
                .status(403)
                .json({ errorMsg: 'Unauthorized user', error: error });
            });
        });
    });
  }
);

exports.sendMessage = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const title = request.body.title;
    const message = request.body.message;

    const payload = {
      notification: {
        title: title,
        body: message,
        icon: msgIconPath
      }
    };

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('shared-user')
          .where('userId', '==', uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
              if (doc.data().sendToken) {
                admin.messaging().sendToDevice(doc.data().sendToken, payload);
              }
              // console.log('Doc id: ', doc.id);
              // console.log('Doc data : ', doc.data());
            });
          })
          .then(() => {
            response.status(200).json({
              message: 'הודעה נשלחה למשתמשים'
            });
          })
          .catch(error => {
            response.status(403).json({
              errorMsg: 'Error Sending user message:',
              error: error
            });
          });
      })
      .catch(error => {
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

exports.shareUser = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const authorizedUserEmail = request.body.email;
    const userEmail = request.body.userEmail;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        admin
          .auth()
          .getUserByEmail(authorizedUserEmail)
          .then(user => {
            // בדיקה האם כבר בוצע שיתוף עם משתמש זה
            isUserSaredList(uid, user.uid).then(querySnapshot => {
              if (querySnapshot.docs.length == 0) {
                db.collection('shared-user')
                  .add({
                    userId: uid,
                    userEmail: userEmail,
                    authorizedUserId: user.uid,
                    authorizedUserEmail: authorizedUserEmail,
                    sendToken: ''
                  })
                  .then(docRef => {
                    response.status(200).json({
                      message: 'שיתוף בוצע בהצלחה',
                      messageNum: 1
                    });
                  })
                  .catch(error => {
                    response.status(403).json({
                      errorMsg: 'Error Adding shared user data:',
                      error: error
                    });
                  });
              } else {
                response.status(200).json({
                  message: 'כבר קיים שיתוף',
                  messageNum: 0
                });
              }
            });
          })
          .catch(error => {
            response
              .status(403)
              .json({ errorMsg: 'Error fetching user data:', error: error });
          });
      })
      .catch(error => {
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

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
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

exports.deleteSharedItem = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const token = request.body.token;
    const listId = request.body.listId;
    const item = request.body.deleteItem;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('shared-list')
          .doc(listId)
          .update({ items: admin.firestore.FieldValue.arrayRemove(item) })
          .then(
            () => {
              response.status(200).json({
                message: 'פריט נמחק בהצלחה',
                deleteItem: item
              });
            },
            error => {
              response.status(401).json({
                title: 'Error',
                message: 'Error Delete Shared Item',
                error: error
              });
            }
          );
      })
      .catch(error => {
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

exports.deleteSharedList = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const listId = request.body.listId;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('shared-list')
          .doc(listId)
          .delete()
          .then(writeResult => {
            response.status(200).json({
              message: 'רשימה משותפת נמחקה בהצלחה',
              listId: listId,
              writeResult: writeResult
            });
          });
      })
      .catch(error => {
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
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
                message: 'רשימה נמחקה בהצלחה',
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
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
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

exports.addSharedListToMyList = functions.https.onRequest(
  (request, response) => {
    cors(request, response, () => {
      const uid = request.body.uid;
      const token = request.body.token;
      const newList = request.body.list;

      admin
        .auth()
        .verifyIdToken(token)
        .then(decodedIdToken => {
          // add new list
          db.collection('super-list')
            .doc(uid)
            .collection('user-list')
            .add(newList)
            .then(
              docRef => {
                response.status(200).json({
                  message: 'רשימה חדשה נקלטה בהצלחה',
                  superList: {
                    id: docRef.id,
                    name: newList.name,
                    description: newList.description,
                    items: newList.items
                  }
                });
              },
              error => {
                response.status(401).json({
                  title: 'Error',
                  message: 'Error Add New Shared list to user',
                  error: error
                });
              }
            );
        })
        .catch(error => {
          response
            .status(403)
            .json({ errorMsg: 'Unauthorized user', error: error });
        });
    });
  }
);

exports.addNewList = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const token = request.body.token;
    const name = request.body.name;
    const description = request.body.description;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        // add new list
        db.collection('super-list')
          .doc(uid)
          .collection('user-list')
          .add({ name: name, description: description, items: [] })
          .then(
            docRef => {
              response.status(200).json({
                message: 'רשימה חדשה נקלטה בהצלחה',
                superList: {
                  id: docRef.id,
                  name: name,
                  description: description,
                  items: []
                }
              });
            },
            error => {
              response.status(401).json({
                title: 'Error',
                message: 'Error Add New Shared list to user',
                error: error
              });
            }
          );
      })
      .catch(error => {
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

exports.addSharedItem = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const sharedList = request.body.sharedList;
    const newItem = request.body.newItem;
    const token = request.body.token;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        // set item id
        if (sharedList.items.length > 0) {
          let index = sharedList.items.length - 1;
          newItem.id = sharedList.items[index].id + 1;
        } else {
          newItem.id = 0;
        }

        db.collection('shared-list')
          .doc(sharedList.id)
          .update({ items: admin.firestore.FieldValue.arrayUnion(newItem) })
          .then(
            () => {
              response.status(200).json({
                message: 'פריט חדש נקלט בהצלחה',
                sharedList: sharedList
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
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

exports.addItem = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const uid = request.body.uid;
    const superList = request.body.superList;
    const newItem = request.body.newItem;
    const token = request.body.token;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        // set item id
        if (superList.items.length > 0) {
          let index = superList.items.length - 1;
          newItem.id = superList.items[index].id + 1;
        } else {
          newItem.id = 0;
        }
        // newItem.id = superList.items.length;
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
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

exports.updateSharedItem = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const token = request.body.token;
    const listId = request.body.listId;
    const oldItem = request.body.oldItem;
    const newItem = request.body.newItem;

    admin
      .auth()
      .verifyIdToken(token)
      .then(decodedIdToken => {
        db.collection('shared-list')
          .doc(listId)
          .get()
          .then(doc => {
            const list = doc.data();
            const itemIndex = getItemIndex(oldItem.id, list);
            list.items[itemIndex] = newItem;

            db.collection('shared-list')
              .doc(listId)
              .update({ items: list.items })
              .then(
                () => {
                  response.status(200).json({
                    message: 'פריט עודכן בהצלחה',
                    id: doc.id,
                    newItem: newItem
                  });
                },
                error => {
                  response.status(401).json({
                    title: 'Error',
                    message: 'Error Update Shared Item',
                    error: error
                  });
                }
              );
          });
      })
      .catch(error => {
        response
          .status(403)
          .json({ errorMsg: 'Unauthorized user', error: error });
      });
  });
});

// exports.sendPicture = functions.https.onRequest((request, response) => {
//   cors(request, response, () => {
//     const uuid = UUID();
//     const busboy = new Busboy({ headers: request.headers });

//     // These objects will store the values (file + fields) extracted from busboy
//     let upload;
//     const fields = {};

//     // This callback will be invoked for each file uploaded
//     busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//       console.log(
//         `File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`
//       );

//       const filepath = path.join(os.tmpdir(), filename);
//       upload = { file: filepath, type: mimetype };
//       file.pipe(fs.createWriteStream(filepath));
//     });

//     // This will invoked on every field detected
//     busboy.on(
//       'field',
//       (
//         fieldname,
//         val,
//         fieldnameTruncated,
//         valTruncated,
//         encoding,
//         mimetype
//       ) => {
//         fields[fieldname] = val;
//       }
//     );

//     // This callback will be invoked after all uploaded files are saved.
//     busboy.on('finish', () => {
//       const bucket = gcs.bucket('superlist-80690.appspot.com/users-pictures');

//       bucket.upload(
//         upload.file,
//         {
//           uploadType: 'media',
//           metadata: {
//             metadata: {
//               contentType: upload.type,
//               firebaseStorageDownloadTokens: uuid
//             }
//           }
//         },
//         (error, uploadedFile) => {
//           if (!error) {
//             console.log('Fields: ', fields);
//             response.status(200).json({
//               message: 'תמונה נטענה בהצלחה',
//               fields: fields
//             });
//           } else {
//             console.log('Send Picture Error: ', error);
//             response
//               .status(403)
//               .json({ errorMsg: 'Error upload pictute: ', error: error });
//           }
//         }
//       );
//     });
//   });
// });

// ===========================================================================================================

// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate(user => {
  return db
    .collection('super-list')
    .doc(user.uid)
    .collection('item-update')
    .add({ itemId: -1, itemName: '', listName: '', uid: '' })
    .then(docRef => {
      db.collection('users')
        .doc(user.uid)
        .set({ role: 'user' })
        .then(resulr => {
          const email = user.email; // The email of the user.
          const displayName = user.displayName; // The display name of the user.
          return sendWelcomeEmail(email, displayName);
        });
    });
});

// [START onDeleteTrigger]
exports.sendDeleteUserEmail = functions.auth.user().onDelete(user => {
  return deleteUserDb(user.uid).then(() => {
    const email = user.email;
    const displayName = user.displayName;

    return sendGoodbyeEmail(email, displayName);
  });
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

// delete user data base after deleting the user
function deleteUserDb(uid) {
  return db
    .collection('super-list')
    .doc(uid)
    .collection('item-update')
    .get()
    .then(
      data => {
        let batch = db.batch();
        data.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        db.collection('super-list')
          .doc(uid)
          .collection('user-list')
          .get()
          .then(snapshot => {
            snapshot.docs.forEach(doc => {
              batch.delete(doc.ref);
            });
            db.collection('users')
              .doc(uid)
              .delete()
              .then(result => {
                batch.commit().then(() => {});
              });
          });
      },
      error => {
        console.log('Delete User DB Error: ', error);
      }
    );
}

// check if user already share his lists
function isUserSaredList(userId, authorizedUserId) {
  return db
    .collection('shared-user')
    .where('userId', '==', userId)
    .where('authorizedUserId', '==', authorizedUserId)
    .get();
}
