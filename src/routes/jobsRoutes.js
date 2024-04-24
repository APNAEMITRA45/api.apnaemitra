const express = require("express");

const {
  getJobs,
  setJobs,
  deleteJob,
  editJob,
  updateInFav,
  getFav,
} = require("../controllers/jobsControllers.js");
const upload = require("../utils/upload.js");

const router = express.Router();
//for mobile
router.get("/get-job", getJobs);
//for admin
router.post("/set-job", upload.single("file"), setJobs);
router.delete("/delete-job/:jobId", deleteJob);
router.put("/edit-job/:jobId", upload.single("file"), editJob);

router.get("/update-fav", updateInFav);
router.get("/get-fav", getFav);

module.exports = router;
