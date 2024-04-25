// Dependency packages

const dbConnection = require("./src/utils/dbConnection.js");
const { MONGODB_URI } = require("./config.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

// Local files import
const route = require("./src/routes/index.js");
const imageRoute = require("./src/routes/imageRoutes.js");

// Used for notification so don't remove
const admin = require("./src/firebase/index.js");

//constans and connection varibles
const app = express();
const connectionString = MONGODB_URI;
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// express items
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

//connecting with database

dbConnection(connectionString);

app.get("/", (req, res) => {
  res.render("index", { pageTitle: "User Interface for us" });
});

app.use("/api", route);

app.use("/image", imageRoute);

app.listen(port, () => console.log(`listening on port${port} `));
