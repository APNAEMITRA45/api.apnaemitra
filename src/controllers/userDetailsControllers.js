const user = require("../models/userModel.js");
const personalDetail = require("../models/personalDetailModel.js");
const familyDetail = require("../models/familyDetail.js");
const addressDetail = require("../models/addressDetail.js");
const addtionalDetail = require("../models/addtionalDetail.js");

exports.setPersonalDetails = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    gender,
    email,
    phone,
    altEmail,
    altPhone,
    maritalStatus,
    identificationMark,
    govServant,
    checkGovServant,
    checkIdentificationMark,
  } = req.body;

  const userId = req.body.params.userId;

  try {
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender ||
      !email ||
      !phone ||
      !maritalStatus ||
      !checkGovServant ||
      !checkIdentificationMark
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        status: 400,
      });
    }

    const User = await user.findOne({ _id: userId }).populate("personalDetail");

    if (User.personalDetail) {
      User.personalDetail.firstName = firstName;
      User.personalDetail.lastName = lastName;
      User.personalDetail.dob = dob;
      User.personalDetail.gender = gender;
      User.personalDetail.email = email;
      User.personalDetail.phone = phone;
      User.personalDetail.altEmail = altEmail;
      User.personalDetail.altPhone = altPhone;
      User.personalDetail.maritalStatus = maritalStatus;
      User.personalDetail.identificationMark = identificationMark;
      User.personalDetail.govServant = govServant;
      User.personalDetail.checkGovServant = checkGovServant;
      User.personalDetail.checkIdentificationMark = checkIdentificationMark;

      await User.personalDetail.save();
    } else {
      const personalDetails = new personalDetail({
        firstName,
        lastName,
        dob,
        gender,
        email,
        phone,
        altEmail,
        altPhone,
        maritalStatus,
        identificationMark,
        govServant,
        checkGovServant,
        checkIdentificationMark,
      });

      await personalDetails.save();

      User.personalDetail = personalDetails._id;
    }

    await User.save();

    return res.status(200).json({
      message: "Personal details updated successfully",
      userPersonalDetails: User.personalDetail,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating/creating personal details:", error);
    return res.status(500).json({
      message: "Error updating/creating personal details, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getPersonalDetails = async (req, res) => {
  try {
    const userId = req.query.userId;
    const PersonalDetails = await user
      .findOne({ _id: userId })
      .populate("personalDetail");
    return res.status(200).json({
      userPersonalDetails: PersonalDetails.personalDetail,
      sucess: true,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Something wrong to get job details",
    });
  }
};

exports.setFamilyDetails = async (req, res) => {
  const {
    fatherName,
    motherName,
    fatherQualification,
    motherQualification,
    fatherOccupation,
    motherOccupation,
    nationality,
    annualIncome,
    minorityCommunity,
    category,
    religion,
  } = req.body;

  const userId = req.body.params.userId;

  try {
    if (
      !category ||
      !religion ||
      !minorityCommunity ||
      !annualIncome ||
      !nationality ||
      !motherName ||
      !fatherName
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        status: 400,
      });
    }
    const User = await user.findOne({ _id: userId }).populate("familyDetail");
    if (User.familyDetail) {
      User.familyDetail.nationality = nationality;
      User.familyDetail.annualIncome = annualIncome;
      User.familyDetail.minorityCommunity = minorityCommunity;
      User.familyDetail.category = category;
      User.familyDetail.fatherQualification = fatherQualification;
      User.familyDetail.motherQualification = motherQualification;
      User.familyDetail.fatherOccupation = fatherOccupation;
      User.familyDetail.motherOccupation = motherOccupation;
      User.familyDetail.fatherName = fatherName;
      User.familyDetail.motherName = motherName;
      User.familyDetail.religion = religion;
      await User.familyDetail.save();
    } else {
      // If User does not have family details, create new family details
      const familyDetails = new familyDetail({
        nationality,
        annualIncome,
        minorityCommunity,
        category,
        fatherQualification,
        motherQualification,
        fatherOccupation,
        motherOccupation,
        fatherName,
        motherName,
        religion,
      });
      await familyDetails.save();
      User.familyDetail = familyDetails._id;
    }

    await User.save();

    return res.status(200).json({
      message: "Family details updated successfully",
      userFamilyDetails: User.familyDetail,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating/creating family details:", error);
    return res.status(500).json({
      message: "Error updating/creating family details, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getFamilyDetails = async (req, res) => {
  try {
    const userId = req.query.userId;
    const FamilyDetails = await user
      .findOne({ _id: userId })
      .populate("familyDetail");
    return res.status(200).json({
      userFamilyDetails: FamilyDetails.familyDetail,
      sucess: true,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Something wrong to get job details",
    });
  }
};

exports.setAddressDetails = async (req, res) => {
  const {
    houseNumber,
    colonyName,
    landmark,
    pincode,
    nearestCity,
    district,
    state,
    fullAddress,
    houseNumberPer,
    colonyNamePer,
    landmarkPer,
    pincodePer,
    nearestCityPer,
    districtPer,
    statePer,
    fullAddressPer,
  } = req.body;

  const userId = req.body.params.userId;

  try {
    if (
      !houseNumber ||
      !colonyName ||
      !district ||
      !state ||
      !fullAddress ||
      !pincode ||
      !houseNumberPer ||
      !colonyNamePer ||
      !districtPer ||
      !statePer ||
      !fullAddressPer ||
      !pincodePer
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        status: 400,
      });
    }
    const User = await user.findOne({ _id: userId }).populate("addressDetail");
    if (User.addressDetail) {
      User.addressDetail.houseNumber = houseNumber;
      User.addressDetail.colonyName = colonyName;
      User.addressDetail.landmark = landmark;
      User.addressDetail.pincode = pincode;
      User.addressDetail.nearestCity = nearestCity;
      User.addressDetail.district = district;
      User.addressDetail.state = state;
      User.addressDetail.fullAddress = fullAddress;
      User.addressDetail.houseNumberPer = houseNumberPer;
      User.addressDetail.colonyNamePer = colonyNamePer;
      User.addressDetail.landmarkPer = landmarkPer;
      User.addressDetail.pincodePer = pincodePer;
      User.addressDetail.nearestCityPer = nearestCityPer;
      User.addressDetail.districtPer = districtPer;
      User.addressDetail.statePer = statePer;
      User.addressDetail.fullAddressPer = fullAddressPer;
      await User.addressDetail.save();
    } else {
      const addressDetails = new addressDetail({
        houseNumber,
        colonyName,
        landmark,
        pincode,
        nearestCity,
        district,
        state,
        fullAddress,
        houseNumberPer,
        colonyNamePer,
        landmarkPer,
        pincodePer,
        nearestCityPer,
        districtPer,
        statePer,
        fullAddressPer,
      });
      await addressDetails.save();
      User.addressDetail = addressDetails._id;
    }
    await User.save();
    return res.status(200).json({
      message: "Address details updated successfully",
      userAddressDetails: User.addressDetail,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating/creating address details:", error);
    return res.status(500).json({
      message: "Error updating/creating address details, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getAddressDetails = async (req, res) => {
  try {
    const userId = req.query.userId;
    const addressDetails = await user
      .findOne({ _id: userId })
      .populate("addressDetail");
    return res.status(200).json({
      userAddressDetails: addressDetails.addressDetail,
      sucess: true,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Something wrong to get address details",
    });
  }
};

exports.setAddtionalDetails = async (req, res) => {
  const { userId } = req.body.params;

  try {
    const additionalDetails = new addtionalDetail(req.body);
    const User = await user
      .findOne({ _id: userId })
      .populate("addtionalDetail");

    if (User.addtionalDetail) {
      Object.assign(User.addtionalDetail, req.body);
      await User.addtionalDetail.save();
    } else {
      User.addtionalDetail = additionalDetails._id;
      await additionalDetails.save();
    }

    await User.save();

    return res.status(200).json({
      message: "Additional details updated successfully",
      userAdditionalDetails: additionalDetails,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating/creating additional details:", error);
    return res.status(500).json({
      message:
        "Error updating/creating additional details, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getAddtionalDetails = async (req, res) => {
  try {
    const userId = req.query.userId;
    const addtionalDetails = await user
      .findOne({ _id: userId })
      .populate("addtionalDetail");
    return res.status(200).json({
      userAddtionalDetails: addtionalDetails.addtionalDetail,
      sucess: true,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      status: 500,
      message: "Something wrong to get addtional details",
    });
  }
};

exports.checkUserDetails = async (req, res) => {
  try {
    const userId = req.query.userId;
    const reqStudyDocs = req.query.reqStudyDocs;
    const userInfo = await user
      .findOne({ _id: userId })
      .populate("studyDocuments");
    const b = reqStudyDocs;
    const a = userInfo.studyDocuments;
    const allElementsExist = b.every((itemB) =>
      a.some((itemA) => itemA.type === itemB)
    );
    return res.status(200).json({
      updateUserInfo: [
        {
          PersonalDetails: userInfo.personalDetail ? true : false,
          FamilyDetails: userInfo.familyDetail ? true : false,
          AddressDetails: userInfo.addressDetail ? true : false,
          IdProof: userInfo.idDocument.length === 5 ? true : false,
          StudyCertificate: allElementsExist,
        },
      ],
      message: "These Detilas are updated",
      sucess: true,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      status: 500,
      message: "Something wrong to get addtional details",
    });
  }
};
