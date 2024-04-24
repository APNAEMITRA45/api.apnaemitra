const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  phone: { type: String, required: true },
  name: { type: String, required: true },
  userId: { type: Number, required: true },
  profileImage: {
    fileName: String,
    url: String,
  },
  favourite: [
    {
      type: String,
    },
  ],
  fcmToken: { type: String },
  personalDetail: {
    type: Schema.Types.ObjectId,
    ref: "personalDetail", // Reference to the jobsType model
  },
  familyDetail: {
    type: Schema.Types.ObjectId,
    ref: "familyDetail", // Reference to the jobsType model
  },
  addressDetail: {
    type: Schema.Types.ObjectId,
    ref: "addressDetail", // Reference to the jobsType model
  },
  addtionalDetail: {
    type: Schema.Types.ObjectId,
    ref: "addtionalDetail", // Reference to the jobsType model
  },
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "order", // Reference to the jobsType model
    },
  ],
  idDocument: [
    {
      type: Schema.Types.ObjectId,
      ref: "idDocument",
    },
  ],
  studyDocuments: [
    {
      type: Schema.Types.ObjectId,
      ref: "studyDocuments",
    },
  ],
});

const user = mongoose.model("user", UserSchema);

module.exports = user;
