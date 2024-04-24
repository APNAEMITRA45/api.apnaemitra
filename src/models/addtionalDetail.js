const mongoose = require("mongoose");

const { Schema } = mongoose;

const AddtionalDetailSchema = new Schema({
  aadharNumber: { type: String },
  twelvethRoll: { type: String },
  tenthRoll: { type: String },
  panCardNumber: { type: String },
  tenthPercentage: { type: String },
  twelvethPercentage: { type: String },
  graduationPercentage: { type: String },
  postGraduationPercentage: { type: String },
  nickName: { type: String },
  favSubject: { type: String },
  favColor: { type: String },
  favTeacher: { type: String },
  favSports: { type: String },
});

const addtionalDetail = mongoose.model(
  "addtionalDetail",
  AddtionalDetailSchema
);

module.exports = addtionalDetail;
