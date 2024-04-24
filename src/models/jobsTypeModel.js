const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobsTypeSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  location: { type: String, required: true },
});

const jobsType = mongoose.model("jobsType", jobsTypeSchema);

module.exports = jobsType;
