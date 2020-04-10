var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

let bulbState = {};
let beforeBulbState = {};
const {getBulbState, sendData} = require('./routes/function.js');

setInterval(async () => {
  bulbState = await getBulbState();
  if(bulbState.on !== beforeBulbState.on){
    console.log(bulbState.on);
    
    sendData('amqp://ksh:1234@3.34.5.103', 'res/hue/state', bulbState);
  }
  beforeBulbState = bulbState;
}, 500);

module.exports = app;