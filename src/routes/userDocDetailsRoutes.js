const express = require("express");
const {
  setIdDocuments,
  getIdDocuments,
  setStudyDocument,
  getStudyDocuments,
} = require("../controllers/userDocDetailsControllers.js");
const upload = require("../utils/upload.js");

const router = express.Router();

//for mobile
router.post("/idDocuments-upload/:type", upload.single("file"), setIdDocuments);
router.get("/idDocuments", getIdDocuments);
router.post(
  "/studyDocuments-upload/:type",
  upload.single("file"),
  setStudyDocument
);
router.get("/studyDocuments", getStudyDocuments);

module.exports = router;
