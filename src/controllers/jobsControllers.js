const jobs = require("../models/jobsModel.js");
const jobDetails = require("../models/jobDetailsModel.js");
const { IMAGE_BASE_URL } = require("../../config.js");
const user = require("../models/userModel.js");
const path = require("path");
const fs = require("fs");

const deleteImageFile = (imageUrl) => {
  const filename = path.basename(imageUrl);
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, "src/uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Image file ${filename} deleted successfully.`);
  } else {
    console.log(`Image file ${filename} does not exist.`);
  }
};

exports.updateInFav = async (req, res) => {
  const { favourite, jobId, userId } = req.query;

  try {
    let updatedTask;

    if (favourite === "true") {
      // Add jobId to favourites
      updatedTask = await user.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { favourite: jobId } }, // Add jobId to favourites if it doesn't already exist
        { new: true }
      );
    } else {
      // Remove jobId from favourites
      updatedTask = await user.findOneAndUpdate(
        { _id: userId },
        { $pull: { favourite: jobId } }, // Remove jobId from favourites
        { new: true }
      );
    }
    const userData = await user.findById(userId);
    const favoriteJobIds = userData.favourite;
    const favoriteJobs = await jobs.find({ _id: { $in: favoriteJobIds } });

    return res.status(200).json({
      message: "Updated favourite job status",
      newFavsJobs: favoriteJobs,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error updating favourite job status:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
};

exports.getFav = async (req, res) => {
  const { userId } = req.query;

  try {
    const userData = await user.findById(userId);
    if (!userData) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        status: 404,
      });
    }
    // Extract favourite jobs from the userData
    const favoriteJobIds = userData.favourite;
    const favoriteJobs = await jobs.find({ _id: { $in: favoriteJobIds } });
    return res.status(200).json({
      favJobs: favoriteJobs,
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving favorite jobs:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
};

exports.setJobs = async (req, res) => {
  const {
    jobName,
    startDate,
    endDate,
    seats,
    location,
    nameOfPost,
    educationQulification,
    favourite,
  } = req.body;
  const jobTypeId = req.query.jobTypeId;
  const trendingStatus = req.query.trendingStatus;
  const { filename } = req.file;
  const image = `${IMAGE_BASE_URL}${filename}`;
  try {
    if (
      !trendingStatus ||
      !favourite ||
      !jobName ||
      !startDate ||
      !endDate ||
      !seats ||
      !location ||
      !nameOfPost ||
      !educationQulification ||
      !image
    ) {
      return res.status(200).json({
        message: "Missing required fields",
        success: false,
        status: 200,
      });
    }
    const Jobs = new jobs({
      jobName,
      nameOfPost,
      image,
      educationQulification,
      startDate,
      endDate,
      seats,
      location,
      trendingStatus,
      favourite,
      jobType: jobTypeId,
    });
    await Jobs.save();

    return res.status(200).json({
      message: "Job created successfully",
      job: Jobs,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error to creating job, something went wrong",
      success: false,
      status: 500,
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobTypeId = req.query.jobTypeId;
    const trendingStatus = req.query.trendingStatus;
    const jobTypeWithJobs = jobTypeId
      ? await jobs.find({ jobType: jobTypeId })
      : await jobs.find({ trendingStatus: trendingStatus });
    // .populate("jobType");

    if (jobTypeWithJobs?.length > 0) {
      return res.status(200).json({
        jobList: jobTypeWithJobs,
        success: true,
        status: 200,
      });
    } else {
      return res.status(200).json({
        message: "No jobs found",
        success: false,
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something wrong to get jobs",
      success: false,
      status: 500,
    });
  }
};

exports.editJob = async (req, res) => {
  const {
    jobName,
    nameOfPost,
    educationQulification,
    startDate,
    endDate,
    seats,
    location,
    trendingStatus,
  } = req.body;
  const filename = req?.file?.filename;
  const image = `${IMAGE_BASE_URL}${filename}`;
  const jobId = req.params.jobId;
  try {
    if (
      !trendingStatus &&
      !jobName &&
      !startDate &&
      !endDate &&
      !seats &&
      !location &&
      !nameOfPost &&
      !educationQulification
    ) {
      return res.status(200).json({
        message: "Missing required fields to update",
        success: false,
        status: 200,
      });
    }
    const existingTask = await jobs.findById(jobId);
    const existingImageUrl = existingTask.image;
    if (filename && existingImageUrl) {
      deleteImageFile(existingImageUrl);
    }

    const data = {
      ...req.body,
      image: filename ? image : existingImageUrl,
    };
    const updatedTask = await jobs.updateOne({ _id: jobId }, data);
    if (updatedTask) {
      return res.status(200).json({
        message: "Job Updated Successfully",
        success: true,
        status: 200,
        updatedTask,
      });
    } else {
      return res.status(200).json({
        message: "Job not found",
        success: false,
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error to edit job",
      success: false,
      status: 500,
    });
  }
};

exports.deleteJob = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const value = await jobs.findOneAndDelete({
      _id: jobId,
    });
    value?.image && deleteImageFile(value?.image);
    const deleteJobDetails = await jobDetails.findOneAndDelete({
      _id: value.jobDetails,
    });
    res.status(200).send({
      message: "Job removed successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error deleting Job",
      success: false,
      status: 500,
    });
  }
};
