var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var index_router = require('./routes/index');
var composers_router = require('./routes/composer');
var periods_router = require('./routes/period');
var crud_router = require('./routes/crud');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static',express.static(path.join(__dirname, '../static/')));

app.use('/', index_router);
app.use('/crud', crud_router);
app.use('/compositores', composers_router);
app.use('/periodos', periods_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url);
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
