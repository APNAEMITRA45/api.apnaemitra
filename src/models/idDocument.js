const mongoose = require("mongoose");

const { Schema } = mongoose;

const IdDocumentSchema = new Schema(
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

const idDocument = mongoose.model("idDocument", IdDocumentSchema);

module.exports = idDocument;
