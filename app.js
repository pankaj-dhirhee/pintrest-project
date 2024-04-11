var dotenv = require('dotenv');
dotenv.config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
var userRoutes = require('./routes/userRoutes.js');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api')
var paginationRouter = require('./routes/pagination');
const connectDb = require("./config/connectdb");

var app = express();

app.use(express.static(path.join(__dirname, "public")));

// view engine setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(expressSession({
	resave: false,
	saveUninitialized: false,
	secret: process.env.EXPRESS_SESSION_SECRET_KEY,
	cookie: {
    // Session expires after 15 min of inactivity.
    expires: 60000 * 10
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connection to database 
connectDb();

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/pagination', paginationRouter);
// User api route to register, login and for rendering forms etc...
app.use("/api/user", userRoutes);


let port = process.env.PORT;
app.listen(port, ()=>{
	console.log("server is running on port:" + ' ' + port)
});

module.exports = app;