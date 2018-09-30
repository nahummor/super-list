importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId:
    'BJEoPTwTI-lti5su-UQyfiJ4YY8kzGZ4lQC_v91KKiSlbud3fYZTjlFxpKIdcLsnswVMjggwSEZ2ctxIY8EkAjs'
});

const messaging = firebase.messaging();
