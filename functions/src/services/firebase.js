const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const field = admin.firestore.FieldValue;
const time = admin.firestore.Timestamp;

module.exports = {
  db,
  field,
  time
};