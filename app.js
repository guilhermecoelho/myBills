require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./app_api/models/db');
var uglifyJs = require('uglify-js');
var fs = require('fs');
var passport = require('passport');
require('./app_api/config/passport');

var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
//var users = require('./app_server/routes/users');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

//uglify-js
var appClientFiles = [
  'app_client/app.js',
  'app_client/views/home/home.controller.js',
  'app_client/views/about/about.controller.js',
  'app_client/views/billDetails/billDetails.controller.js',
  'app_client/views/billDetailsModal/billDetailsModal.controller.js',
  'app_client/views/auth/register/register.controller.js',
  'app_client/views/auth/login/login.controller.js',
  'app_client/views/auth/confirmEmail/confirmEmail.controller.js',
  'app_client/views/auth/account/account.controller.js',
  'app_client/views/modals/confirm.controller.js',
  'app_client/views/modals/alert/alert.controller.js',
  'app_client/common/filters/addHtmlLineBreaks.filter.js',
  'app_client/common/services/billData.service.js',
  'app_client/common/services/authentication.service.js',
  'app_client/common/directives/footerGeneric/footerGeneric.directive.js',
  'app_client/common/directives/navegation/navegation.directive.js',
  'app_client/common/directives/navegation/navegation.controller.js',
  'app_client/common/directives/pageHeader/pageHeader.directive.js',
];

var uglified = uglifyJs.minify(appClientFiles, { compress: false });

fs.writeFile('public/javascripts/bill.min.js', uglified.code, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('script generated and saved: bill.min.js')
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
//app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(passport.initialize());



//app.use('/', routes);
app.use('/api', routesApi);
//app.use('/users', users);

app.use(function (req, res) {
  res.sendfile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ "message": err.name + ": " + err.message });
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
