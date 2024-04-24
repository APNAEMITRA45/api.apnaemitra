const mongoose = require("mongoose");

const { Schema } = mongoose;

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const payment = mongoose.model("payment", PaymentSchema);

module.exports = payment;
