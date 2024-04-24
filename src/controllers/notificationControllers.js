const admin = require("firebase-admin");
const user = require("../models/userModel.js");

exports.updateFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    const User = await user.findById(userId);
    if (!User) {
      return res.status(404).send(`User with ID ${userId} not found`);
    }

    // Replace any existing token with the new one
    User.fcmToken = fcmToken;

    await User.save();
    res.status(200).send("FCM token saved successfully");
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).send("Internal Server Error");
  }
};
exports.sendNotification = async (req, res) => {
  const { title, body, userId, orderId } = req.body;
  const notification = {
    title: title,
    body: body,
  };
  try {
    // Retrieve the user from the database
    const User = await user.findById(userId);
    if (!User) {
      return res.status(200).json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }

    // Retrieve the FCM token associated with the User
    const fcmToken = User.fcmToken;

    // Send the notification using the retrieved FCM token
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        navigationRoute: "DashboardStack/OrderDetails",
        orderId: orderId,
        userId: userId,
      },
    });

    return res.status(200).json({
      message: "Notification sent successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
};

exports.saveFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    const User = await user.findById(userId);
    if (User) {
      // Check if the token already exists in the array
      if (!User.fcmTokens.includes(fcmToken)) {
        // Append the new token to the array
        User.fcmTokens.push(fcmToken);
        await User.save();
        res.status(200).send("FCM token saved successfully");
      } else {
        res.status(200).send("FCM token already exists for this user");
      }
    } else {
      res.status(404).send(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error("Error saving FCM token:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.removeFcmToken = async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
    const User = await user.findById(userId);
    // If User is found
    if (User) {
      // Check if the token exists in the User's FCM tokens array
      const index = User.fcmTokens.indexOf(fcmToken);
      if (index !== -1) {
        // Remove the token from the array
        User.fcmTokens.splice(index, 1);
        // Save the updated User object
        await User.save();
        res
          .status(200)
          .send(`FCM token removed successfully for user ${userId}`);
      } else {
        res
          .status(200)
          .send(`FCM token ${fcmToken} does not exist for user ${userId}`);
      }
    } else {
      res.status(200).send(`User with ID ${userId} not found`);
    }
  } catch (error) {
    console.error("Error removing FCM token:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.sendNotificationToAllUsers = async (req, res) => {
  try {
    const jobId = req.body.jobId;
    // Retrieve all user FCM tokens from the database
    const users = await user.find({}, { fcmToken: 1 });

    // Loop through each user and send notification
    for (const User of users) {
      const { fcmToken } = User;
      if (fcmToken) {
        await admin.messaging().send({
          token: fcmToken,
          notification: {
            title: req?.body?.title || "Default Title",
            body: req?.body?.body || "Default Body",
          },
          data: {
            navigationRoute: "DashboardStack/JobDetails",
            id: jobId,
          },
        });
      }
    }
    res.status(200).json({
      message: "Notifications sent successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).send("Internal server error");
  }
};
