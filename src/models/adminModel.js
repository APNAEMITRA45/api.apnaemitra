const mongoose = require("mongoose");

const { Schema } = mongoose;

const AdminSchema = new Schema({
  password: { type: String, required: true },
  adminId: { type: String, required: true },
});

const admin = mongoose.model("admin", AdminSchema);

module.exports = admin;
