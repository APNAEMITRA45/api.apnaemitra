const mongoose = require("mongoose");

const { Schema } = mongoose;

const FamilyDetailSchema = new Schema({
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  fatherQualification: { type: String },
  motherQualification: { type: String },
  fatherOccupation: { type: String },
  motherOccupation: { type: String },
  nationality: { type: String, required: true },
  annualIncome: { type: String, required: true },
  minorityCommunity: { type: String, required: true },
  category: { type: String, required: true },
  religion: { type: String, required: true },
});

const familyDetail = mongoose.model("familyDetail", FamilyDetailSchema);

module.exports = familyDetail;
