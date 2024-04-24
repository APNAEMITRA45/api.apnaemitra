const mongoose = require("mongoose");

const { Schema } = mongoose;

const jobsSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  jobName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  nameOfPost: {
    type: String,
    required: true,
  },
  educationQulification: {
    type: String,
    required: true,
  },
  trendingStatus: {
    type: String,
    required: true,
  },
  jobType: {
    type: Schema.Types.ObjectId,
    ref: "jobsType", // Reference to the jobsType model
  },
  jobDetails: {
    type: Schema.Types.ObjectId,
    ref: "jobDetails", // Reference to the jobsType model
  },
});

const jobs = mongoose.model("jobs", jobsSchema);

module.exports = jobs;
