const express = require("express");

const {
  getJobDetails,
  setJobDetails,
  deleteJobDetails,
  editJobDetails,
} = require("../controllers/jobDetailsControllers.js");

const router = express.Router();
//for mobile
router.get("/get-jobDetails", getJobDetails);
//for admin
router.post("/set-jobDetails", setJobDetails);
router.delete("/delete-jobDetails", deleteJobDetails);
router.put("/edit-jobDetails", editJobDetails);

module.exports = router;
