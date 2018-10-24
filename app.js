require("./config/config");
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var index = require("./routes/index");
var user = require("./routes/user");
var leave = require("./routes/leave");
var admin = require("./routes/admin");
var cronLeave = require("./utils/cronLeaveCredit");

var app = express();
cronLeave.start();

mongoose
  .connect(
    process.env.MONGODB_URI,
    { useCreateIndex: true, useNewUrlParser: true }
  )
  .then(
    () => {
      console.log("Now connected to mongoDB");
    },
    err => console.error(err)
  );

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/", index);
app.use("/user", user);
app.use("/leave", leave);
app.use("/admin", admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.message || "Shoot! An error has occurred.",
    errorStack: err
  });
});

module.exports = app;
