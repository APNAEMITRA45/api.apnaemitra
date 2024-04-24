const jobDetails = require("../models/jobDetailsModel.js");
const jobs = require("../models/jobsModel.js");

exports.setJobDetails = async (req, res) => {
  const {
    maxAge,
    minAge,
    startBornDate,
    endBornDate,
    information,
    website,
    examDate,
    minSalary,
    maxSalary,
    selectionProcess,
    postWiseVacancy,
    formFees,
    requiredDocs,
  } = req.body;
  const jobId = req.query.jobId;
  try {
    if (!maxAge || !minAge || !website || !information) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        status: 400,
      });
    }
    const JobDetails = new jobDetails({
      maxAge,
      minAge,
      startBornDate,
      endBornDate,
      information,
      website,
      examDate,
      minSalary,
      maxSalary,
      selectionProcess,
      postWiseVacancy,
      formFees,
      requiredDocs,
    });
    const job = await jobs.findOne({ _id: jobId }).populate("jobDetails");
    if (job) {
      job.jobDetails = JobDetails._id;
      await JobDetails.save();
      await job.save();
      return res.status(200).json({
        message: "Job details inserted successfully",
        success: true,
        status: 200,
      });
    } else {
      return res.status(200).json({
        message: "Job not found",
        success: false,
        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error to insert job details, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.query.jobId;
    const jobDetails = await jobs
      .findOne({ _id: jobId })
      .populate("jobDetails");
    return res.status(200).json({
      jobList: jobDetails,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Something wrong to get job details",
    });
  }
};

exports.editJobDetails = async (req, res) => {
  const jobId = req.query.jobId;
  try {
    const job = await jobs.findOne({ _id: jobId });
    if (job) {
      const updatedTask = await jobDetails.updateOne(
        { _id: job.jobDetails },
        req.body
      );
      return res.status(200).json({
        message: "Job details updated successfully",
        success: true,
        status: 200,
        updatedTask,
      });
    } else {
      return res.status(404).json({
        message: "Job details not found",
        success: false,
        status: 404,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error to edit job details",
      sucess: false,
      status: 500,
    });
  }
};

exports.deleteJobDetails = async (req, res) => {
  const jobId = req.query.jobId;
  try {
    const job = await jobs.findOne({ _id: jobId });
    if (job) {
      await jobDetails.findOneAndDelete({
        _id: job.jobDetails,
      });
      res.status(200).send({
        message: "Job details removed successfully",
        success: true,
        status: 200,
      });
    } else {
      return res.status(404).send({
        message: "Job not found",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error deleting Job",
      sucess: false,
      status: 500,
    });
  }
};
