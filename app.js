var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const http = require('http');
// const io = require('socket.io')(http);
var app = express();
// var consumer = require('./functions/socket.io/consumer');
// consumer.start(http, app);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://00tanveer:the3men@cluster0-shard-00-00-awcer.azure.mongodb.net:27017,cluster0-shard-00-01-awcer.azure.mongodb.net:27017,cluster0-shard-00-02-awcer.azure.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {useNewUrlParser: true})

//allow CORS

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');  
});

module.exports = app;
