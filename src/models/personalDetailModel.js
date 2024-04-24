const mongoose = require("mongoose");

const { Schema } = mongoose;

const PersonalDetailSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  identificationMark: { type: String },
  govServant: { type: String },
  checkGovServant: { type: String, required: true },
  checkIdentificationMark: { type: String, required: true },
  altEmail: { type: String },
  altPhone: { type: String },
});

const personalDetail = mongoose.model("personalDetail", PersonalDetailSchema);

module.exports = personalDetail;
