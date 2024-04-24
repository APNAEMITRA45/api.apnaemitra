const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrdStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["initated", "processing", "completed"],
    default: "initated",
  },
  statusHistory: {
    status: String,
    timestamp: { type: Date, default: Date.now },
  },
});

const ordStatus = mongoose.model("ordStatus", OrdStatusSchema);

module.exports = ordStatus;
