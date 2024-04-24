const mongoose = require("mongoose");

const { Schema } = mongoose;

const jobDetailsSchema = new Schema({
  maxAge: {
    type: Number,
    required: true,
  },

  minAge: {
    type: Number,
    required: true,
  },
  startBornDate: {
    type: Date,
  },
  endBornDate: {
    type: Date,
  },
  website: {
    type: String,
    required: true,
  },
  information: {
    type: String,
    required: true,
  },
  examDate: {
    type: Date,
  },
  minSalary: {
    type: Number,
  },
  maxSalary: {
    type: Number,
  },
  selectionProcess: [String],
  postWiseVacancy: {
    type: Map,
    of: Number,
  },
  formFees: {
    type: Map,
    of: Number,
  },
  requiredDocs: [String],
});

const jobDetails = mongoose.model("jobDetails", jobDetailsSchema);
module.exports = jobDetails;
