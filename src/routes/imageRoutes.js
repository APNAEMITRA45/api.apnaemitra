const express = require("express");
const path = require("path");

const app = express();

//for images upload

const uploadPath = path.join(__dirname, "../uploads");

app.use("/doc", express.static(uploadPath));

module.exports = app;
