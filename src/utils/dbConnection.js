const mongoose = require("mongoose");

const dbConnection = (URL) => {
  mongoose
    .connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((error) => {
      console.error("Error connecting to database:", error);
    });
};

module.exports = dbConnection;
