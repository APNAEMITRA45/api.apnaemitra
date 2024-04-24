const express = require("express");

const authRoutes = require("./authRoutes.js");
const jobDetailsRoutes = require("./jobDetailsRoutes.js");
const jobsTypeRoutes = require("./jobsTypeRoutes.js");
const jobsRoutes = require("./jobsRoutes.js");
const userDetailsRoutes = require("./userDetailsRoutes.js");
const userDocDetailsRoutes = require("./userDocDetailsRoutes.js");
const orderRoutes = require("./orderRoutes.js");
const notificationRoutes = require("./notificationRoutes.js");

const app = express();

app.use("/login", authRoutes);
app.use("/jobsType", jobsTypeRoutes);
app.use("/jobs", jobsRoutes);
app.use("/jobDetails", jobDetailsRoutes);
app.use("/order", orderRoutes);
app.use("/userDetails", userDetailsRoutes);
app.use("/userDocDetails", userDocDetailsRoutes);
app.use("/notification", notificationRoutes);

//for images upload
// app.use("/doc", express.static("./src/uploads"));

module.exports = app;
