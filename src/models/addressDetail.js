const mongoose = require("mongoose");

const { Schema } = mongoose;

const AddressDetailSchema = new Schema({
  houseNumber: { type: String, required: true },
  pincode: { type: String, required: true },
  colonyName: { type: String, required: true },
  landmark: { type: String },
  nearestCity: { type: String },
  district: { type: String, required: true },
  state: { type: String, required: true },
  fullAddress: { type: String, required: true },
  houseNumberPer: { type: String, required: true },
  pincodePer: { type: String, required: true },
  colonyNamePer: { type: String, required: true },
  landmarkPer: { type: String },
  nearestCityPer: { type: String },
  districtPer: { type: String, required: true },
  statePer: { type: String, required: true },
  fullAddressPer: { type: String, required: true },
});

const addressDetail = mongoose.model("addressDetail", AddressDetailSchema);

module.exports = addressDetail;
