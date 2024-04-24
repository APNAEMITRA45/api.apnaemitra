const jobsType = require("../models/jobsTypeModel.js");
const { IMAGE_BASE_URL } = require("../../config.js");
const jobs = require("../models/jobsModel.js");
const jobDetails = require("../models/jobDetailsModel.js");
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

exports.editJobsType = async (req, res) => {
  const filename = req?.file?.filename;
  const jobsTypeId = req.params.jobsTypeId;
  const image = `${IMAGE_BASE_URL}${filename}`;

  try {
    const existingTask = await jobsType.findById(jobsTypeId);
    const existingImageUrl = existingTask.image;

    if (filename && existingImageUrl) {
      deleteImageFile(existingImageUrl);
    }

    const data = {
      ...req.body,
      image: filename ? image : existingImageUrl, // Use new image if provided, otherwise keep the existing image
    };

    const updatedTask = await jobsType.updateOne({ _id: jobsTypeId }, data);
    if (updatedTask.modifiedCount > 0) {
      return res.status(200).json({
        message: "Jobs type updated Successfully",
        success: true,
        status: 200,
        updatedTask,
      });
    } else {
      return res.status(200).json({
        message: "Jobs type not found",
        success: false,
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error To edit jobs type",
      success: false,
      status: 500,
    });
  }
};

exports.getJobsType = async (req, res) => {
  try {
    const jobsTypeList = await jobsType.find();
    if (jobsTypeList.length > 0) {
      res.status(200).json({
        jobsType: jobsTypeList,
        success: true,
        status: 200,
      });
    } else {
      res.status(200).json({
        message: "No jobs type found",
        success: false,
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching jobs type",
      success: false,
      status: 500,
    });
  }
};

exports.deleteJobsType = async (req, res) => {
  const jobsTypeId = req.params.jobsTypeId;

  try {
    const deletedJobs = await jobs.find({ jobType: jobsTypeId });
    const deletedJobIds = deletedJobs.map((job) => job.jobDetails);

    deletedJobs.map((job) => {
      deleteImageFile(job?.image);
    });

    await jobDetails.deleteMany({ _id: { $in: deletedJobIds } });
    await jobs.deleteMany({ jobType: jobsTypeId });
    const value = await jobsType.findOneAndDelete({
      _id: jobsTypeId,
    });
    value?.image && deleteImageFile(value?.image);
    if (value) {
      res.status(200).send({
        message: "jobs type removed successfully",
        success: true,
        status: 200,
      });
    } else {
      res.status(404).send({
        message: "jobs type not found",
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error deleting Jobs type",
      success: false,
      status: 500,
    });
  }
};

exports.setJobsType = async (req, res) => {
  const { name, location } = req.body;
  const filename = req?.file?.filename;
  const image = `${IMAGE_BASE_URL}${filename}`;

  try {
    if (!name || !location || !image) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
        status: 400,
      });
    }
    const JobsType = new jobsType({
      name,
      location,
      image,
    });
    await JobsType.save();
    return res.status(200).json({
      message: "Jobs type created successfully",
      jobsType: JobsType,
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating jobs type, something went wrong",
      success: false,
      status: 500,
    });
  }
};
