const express = require("express");
const {
  setPersonalDetails,
  getFamilyDetails,
  setFamilyDetails,
  getPersonalDetails,
  setAddressDetails,
  getAddressDetails,
  setAddtionalDetails,
  getAddtionalDetails,
  checkUserDetails,
} = require("../controllers/userDetailsControllers.js");

const router = express.Router();
//for mobile
router.post("/personal-details", setPersonalDetails);
router.get("/personal-details", getPersonalDetails);
router.post("/family-details", setFamilyDetails);
router.get("/family-details", getFamilyDetails);
router.post("/address-details", setAddressDetails);
router.get("/address-details", getAddressDetails);
router.post("/additional-details", setAddtionalDetails);
router.get("/additional-details", getAddtionalDetails);
//on which screen routing
router.get("/check/user-details", checkUserDetails);

module.exports = router;
