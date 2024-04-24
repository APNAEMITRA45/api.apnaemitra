const mongoose = require("mongoose");

const { Schema } = mongoose;

const StudyDocumentsSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const studyDocuments = mongoose.model("studyDocuments", StudyDocumentsSchema);

module.exports = studyDocuments;
