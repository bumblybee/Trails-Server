var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const errorHandlers = require("./handlers/errorHandlers");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");
const trailRouter = require("./routes/trails");
const bookmarkRouter = require("./routes/bookmarks");
const editRouter = require("./routes/edit");
const seedRouter = require("./routes/seed");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// TODO: Remove heroku server after up and running
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://trailscout.herokuapp.com",
      "https://trailscout-server.herokuapp.com",
    ],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static file to get images from
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/trails", trailRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/edit", editRouter);
app.use("/seed", seedRouter);

app.use(errorHandlers.sequelizeErrorHandler);
app.use(errorHandlers.notFound);

if (app.get("env") === "development") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

if (process.env.NODE_ENV === "development") {
  console.log("Environment=Development");
}

if (process.env.NODE_ENV === "production") {
  console.log("Environment=Production");
}

module.exports = app;
