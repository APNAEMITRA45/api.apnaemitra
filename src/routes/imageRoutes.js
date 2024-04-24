const express = require("express");

const app = express();

//for images upload

app.use("/doc", express.static("./src/uploads"));

module.exports = app;
