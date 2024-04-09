var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/people')
var sportsRouter = require('./routes/sports');

var app = express();
var mongoose = require('mongoose');
var mongodb = 'mongodb://localhost:5000/ficha';

mongoose.connect(mongodb);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'))
db.once('open', function() {
  console.log('Connected to MongoDB')
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, '../static/')));

app.use('/', indexRouter);
app.use('/pessoas', usersRouter);
app.use('/modalidades', sportsRouter);

module.exports = app;
