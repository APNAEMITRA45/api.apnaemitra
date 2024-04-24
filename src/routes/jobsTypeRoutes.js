const express = require("express");

const {
  getJobsType,
  setJobsType,
  deleteJobsType,
  editJobsType,
} = require("../controllers/jobsTypeControllers.js");
const upload = require("../utils/upload.js");

const router = express.Router();
//for mobile
router.get("/get-jobsType", getJobsType);
//for admin
router.post("/set-jobsType", upload.single("file"), setJobsType);
router.delete("/delete-jobsType/:jobsTypeId", deleteJobsType);
router.put("/edit-jobsType/:jobsTypeId", upload.single("file"), editJobsType);

module.exports = router;
