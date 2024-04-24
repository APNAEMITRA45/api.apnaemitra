// Dependency packages
const express = require("express");
const {
  sendOtp,
  varifyOtp,
  getUsers,
  adminLogin,
  createAdmin,
  getAdmins,
  setUserProfile,
  getProfileImage,
} = require("../controllers/authControllers.js");
const upload = require("../utils/upload.js");

const router = express.Router();
//mobile App Authenticaiton
router.post("/send-otp", sendOtp);
router.post("/varify-otp", varifyOtp);
router.get("/get-users", getUsers);
//usre proile image
router.post("/set-user-profile", upload.single("file"), setUserProfile);
router.get("/get-user-profile", getProfileImage);
//Admin web Authenticaiton
router.post("/admin/login-admin", adminLogin);
router.post("/admin/create-admin", createAdmin);
router.get("/admin/get-admin-users", getAdmins);

module.exports = router;
