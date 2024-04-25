const admin = require("firebase-admin");

const serviceAccount = require("./apnaemitra-a0541-firebase-adminsdk-6uuk6-01f63e6d8e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //   projectId: "apnaemitra-a0541",
});

module.exports = admin;
