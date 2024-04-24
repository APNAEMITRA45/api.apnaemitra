const axios = require("axios");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const user = require("../models/userModel.js");
const admin = require("../models/adminModel.js");
const { generateUserId } = require("../utils/generateUserId.js");
const { IMAGE_BASE_URL } = require("../../config.js");
const path = require("path");
const fs = require("fs");
const {
  TOQUICK_API_KEY,
  SENDER_PHONE,
  TOQUICK_URL,
} = require("../../config.js");

const otpStore = {};

exports.sendOtp = async (req, res) => {
  const { phone, name } = req.body;
  //Generate otp
  const otp = randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  //Check Phone number
  if (!phone) return res.status(401).json({ error: "Invalid Phone Number" });

  try {
    //Send otp api implementaition
    await axios
      .post(
        `${TOQUICK_URL}?api_key=${TOQUICK_API_KEY}&sender=${SENDER_PHONE}&number=91${phone}&message=${otp}  is your ApnaEmitra login code `
      )
      .then((res) => {
        if (res?.status === 200 && res?.data?.status) otpStore[phone] = otp;
      });
    //Response when every thing ok
    res.status(200).json({
      status: 200,
      message: "OTP has been sent successfully.",
    });
  } catch (error) {
    //Response if try bock consist error
    res.status(400).json({ error: error.message });
  }
};

exports.varifyOtp = async (req, res) => {
  const { phone, otp, name } = req.body;
  //Check otp are matched or not
  if (otp !== otpStore[phone])
    return res.status(401).json({ error: "Otp is not matched" });

  try {
    //Token generated from phone number
    const existingUser = await user.findOne({ phone });
    if (existingUser) {
      if (existingUser.name !== name) {
        existingUser.name = name;
        await existingUser.save();
      }
      const payload = {
        phone: phone,
      };
      const token = jwt.sign(payload, "mysecret", { expiresIn: "1h" });
      res.status(200).json({
        user: existingUser,
        success: true,
        status: 200,
        message: "Login successfully",
        token,
      });
    } else {
      const payload = {
        phone: phone,
      };
      const token = jwt.sign(payload, "mysecret", { expiresIn: "1h" });
      const userId = generateUserId(11);
      const User = new user({
        phone,
        name,
        userId: userId,
      });
      //Response when every thing ok
      User.save().then(() =>
        res.status(200).json({
          user: User,
          success: true,
          status: 200,
          message: "Login successfully",
          token,
        })
      );
    }
  } catch (error) {
    //Response if try bock consist error
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await user.find();
    return res.status(200).json({
      message: "Users List",
      users: users,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error to get users, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const users = await admin.find();
    return res.status(200).json({
      message: "Admin List",
      users: users,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error to get Admin users, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.createAdmin = async (req, res) => {
  const { adminId, password, secretKey, phone, email } = req.body;
  //Check otp are matched or not

  if (secretKey !== "Rohit45@")
    return res.status(200).json({
      success: false,
      status: 200,
      message: "Secret Key not match, So you can not create admin user",
    });
  if (phone !== "6375752015")
    return res.status(200).json({
      success: false,
      status: 200,
      message: "Phone numbe, So you can not create admin user",
    });
  if (email !== "sur.pus.apnaemitra@gmail.com")
    return res.status(200).json({
      success: false,
      status: 200,
      message: "Email not match, So you can not create admin user",
    });

  try {
    //Token generated from phone number
    const existingUser = await admin.findOne({ adminId });
    if (existingUser) {
      res.status(200).json({
        success: false,
        status: 200,
        message: "Admin user with this userId already exist",
      });
    } else {
      const Admin = new admin({
        adminId,
        password,
      });
      Admin.save();
      res.status(200).json({
        success: true,
        status: 200,
        message: "Admin user created successfully",
      });
    }
  } catch (error) {
    //Response if try bock consist error
    res.status(400).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  const { adminId, password } = req.body;
  //Check otp are matched or not
  try {
    //Token generated from phone number
    const existingUser = await admin.findOne({ adminId });
    if (existingUser.password === password) {
      const payload = {
        adminId: adminId,
        password: password,
      };
      const secondsInYear = 365 * 24 * 60 * 60;
      const token = jwt.sign(payload, "mysecret", { expiresIn: secondsInYear });
      res.status(200).json({
        adminUser: existingUser,
        success: true,
        status: 200,
        message: "Login successfully",
        token,
      });
    }
  } catch (error) {
    //Response if try bock consist error
    res.status(400).json({
      success: false,
      status: 400,
      message: "Error to login",
    });
  }
};

exports.setUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    const { filename } = req.file;
    const imageURL = `${IMAGE_BASE_URL}${filename}`;
    const userInstance = await user.findOne({ _id: userId });

    if (!userInstance) {
      return res.status(200).json({
        status: 404,
        success: false,
        message: "No user found",
      });
    }

    const updateUserProfile = async (filename, imageURL) => {
      const oldDocument = userInstance.profileImage;
      if (
        oldDocument &&
        oldDocument.fileName &&
        oldDocument.fileName !== filename
      ) {
        removeOldDoc(oldDocument);
      }

      userInstance.profileImage = {
        fileName: filename,
        url: imageURL,
      };

      await userInstance.save();

      return userInstance;
    };

    const removeOldDoc = (oldDocument) => {
      const __dirname = path.resolve();
      const filePath = path.join(
        __dirname,
        "src/uploads",
        oldDocument.fileName
      );
      fs.unlinkSync(filePath);
    };

    const updatedUser = await updateUserProfile(filename, imageURL);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Profile image uploaded successfully",
      userProfile: updatedUser.profileImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile image",
    });
  }
};

exports.getProfileImage = async (req, res) => {
  try {
    const userId = req.query.userId;
    const User = await user.findById(userId);

    if (!User) {
      return res
        .status(200)
        .json({ status: 200, success: false, message: "User not found" });
    }

    if (!User.profileImage) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "Profile image not found",
      });
    }

    res
      .status(200)
      .json({ status: 200, success: true, profileImage: User.profileImage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving profile image" });
  }
};
