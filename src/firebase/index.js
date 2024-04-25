// import { initializeApp } from "firebase-admin/app";
// import { credential } from "firebase-admin";
// import firebase from "firebase-admin";

// // Path to your service account key file
// const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// // Initialize the Firebase Admin SDK with the service account credentials
// initializeApp({
//   credential: credential.cert(serviceAccount),
//   //   projectId: "apnaemitra-a0541",
// });

// export default firebase;

const admin = require("firebase-admin");

// const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
// const serviceAccount =
//   "apnaemitra-a0541-firebase-adminsdk-6uuk6-01f63e6d8e.json";
const serviceAccount = require("./apnaemitra-a0541-firebase-adminsdk-6uuk6-01f63e6d8e.json");
console.log(serviceAccount, "sea");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //   projectId: "apnaemitra-a0541",
});

module.exports = admin;

// var admin = require("firebase-admin");

// var serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
