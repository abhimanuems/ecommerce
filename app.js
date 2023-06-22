const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const db = require("./config/connection");
const session = require("express-session");
const router = require("./routes/user");
// const fileUpload = require("express-fileupload");
const handleBarHelpers = require('./handlebarHelpers/helper.js');
require("dotenv").config();


db.connect();

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
// Configure Handlebars
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: __dirname+ "/handlebarHelpers/",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(fileUpload());

app.use((req, res, next) => {
  res.header(
    "Cache-control",
    "no-cache,private,no-store,must-revalidate,max-stale=0, post-check=0,pre-check=0"
  );
  next();
});
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/admin", adminRouter);
app.use("/", userRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("eneted ghere")
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
