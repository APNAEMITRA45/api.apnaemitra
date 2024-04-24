const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "src/uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
