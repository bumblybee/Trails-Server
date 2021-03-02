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

// TODO: Remove heroku server after up and running
app.use(
  cors({
    origin: ["http://localhost:3000", "https://trailscout.herokuapp.com/"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", [
    "http://localhost:3000",
    "https://trailscout.herokuapp.com/",
  ]);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static file to get images from
// app.use(express.static(path.join(__dirname, "uploads")));
const morganLogStyle = app.get("env") === "development" ? "dev" : "common";
app.use(logger(morganLogStyle));
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
