const express = require("express");

const {
  sendNotification,
  saveFcmToken,
  removeFcmToken,
  updateFcmToken,
  sendNotificationToAllUsers,
} = require("../controllers/notificationControllers.js");

const router = express.Router();
//for mobile
router.post("/send-notification", sendNotification);
router.post("/save-fcm-token", saveFcmToken);
router.post("/remove-fcm-token", removeFcmToken);
router.post("/update-fcm-token", updateFcmToken);
router.post("/send-notification-all", sendNotificationToAllUsers);

module.exports = router;
