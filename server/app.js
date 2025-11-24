var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var loginRouter = require("./routes/login");
var signUpRouter = require("./routes/signUp");

var filesRouter = require("./routes/files");

var cors = require("cors");
var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", loginRouter);
app.use("/login", loginRouter);
app.use("/signUp", signUpRouter);
app.use("/files", filesRouter);

module.exports = app;
