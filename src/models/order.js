const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderSchema = new Schema({
  ordStatus: [
    {
      type: Schema.Types.ObjectId,
      ref: "ordStatus", // Reference to the jobsType model
    },
  ],
  // payment: {
  //   type: Schema.Types.ObjectId,
  //   ref: "payment", // Reference to the jobsType model
  // },
  otps: {
    emailOTP: String, // Stores email OTP
    mobileOTP: String, // Stores mobile OTP
  },
  postPreference: [String],
  orders: { type: Object },
});

const order = mongoose.model("order", OrderSchema);

module.exports = order;
