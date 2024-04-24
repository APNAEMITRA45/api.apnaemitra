// Dependency packages

const dbConnection = require("./src/utils/dbConnection.js");
const { MONGODB_URI } = require("./config.js");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");

// Local files import
const route = require("./src/routes/index.js");
const imageRoute = require("./src/routes/imageRoutes.js");
const user = require("./src/models/userModel.js");

// Used for notification so don't remove
const admin = require("./src/firebase/index.js");

//constans and connection varibles
const app = express();
const connectionString = MONGODB_URI;
const port = process.env.PORT || 3000;
// express items
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

//connecting with database

dbConnection(connectionString);

// Use routes
// mongoose.set("strictQuery", false);
// app.get("/api", async (req, res) => {
//   try {
//     // Connect to the database
//     console.log(connectionString, "connection string");
//     await mongoose.connect(
//       "mongodb+srv://apnaemitra:Rohit45@cluster0.mmqwssx.mongodb.net/test?retryWrites=true&w=majority",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log("Connected to database successfully");

//     // Query the database (assuming 'user' is your mongoose model)
//     const users = await user.find();

//     // Send response
//     res.send({
//       message: "Connected to database successfully++_______..____>>",
//       users: users,
//       success: true,
//       status: 300,
//     });
//   } catch (error) {
//     // Handle errors
//     res.status(500).send({
//       message: "Error connecting to database>>>",
//       error: error.message,
//       success: false,
//       status: 600,
//     });
//     console.error("Error connecting to database:", error);
//   }
// });

app.use("/api", route);

app.use("/image", imageRoute);

app.listen(port, () => console.log(`listening on port${port} `));
