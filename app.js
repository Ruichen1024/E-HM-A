var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/myDB' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const statsController = require('./controllers/statsController')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/intro', function(req, res, next) {
  res.render('intro',{title:"EMCare Intro"});
});

app.get('/care', function(req, res, next) {
  res.render('care',{title:"EMCare Care"});
});

app.get('/myform', function(req, res, next) {
  res.render('myform',{title:"EMCare form"});
});

app.post('/form2', function(req, res, next) {
  res.render('form2data',{title:"Form2 Data", stat:req.body.Stats});
});


function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",name:req.body.name, age:req.body.age, bp:req.body.bp, pulse:req.body.pulse})
}

app.post('/processform', statsController.saveStats)

app.get('/Added', function(req, res, next) {
  res.render('Added',{title:"ADD"});
});

app.post('/showStats', statsController.getAllStats)

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
