var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var validator = require('express-validator');
var i18n = require('i18n');
var flash = require('express-flash');
var exphbs = require('express-handlebars');
var routerMember = require('./routes/member');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var languageRouter = require('./routes/change-languages');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var routerAdmin = require('./routes/admin');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true })
var app = express();

mongoose.connect('mongodb://localhost:27017/CLASSFEILD');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.use(validator());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
i18n.configure({
    locales : ['en','vi'],
    defaultLocale:'en',
    fallbacks : ['vi','en'],
    cookie :'languages',
    directory : __dirname+'/languages',
});
app.use(flash());
require('./config/passport');
app.use(session({
  secret : "secret",
  saveUninitialized:true,
  resave:true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(i18n.init);
app.use('/',indexRouter);
app.use('/users', usersRouter);
app.use('',languageRouter);
app.use('/member',csrfProtection,routerMember);
app.use('/admin',csrfProtection,routerAdmin);


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
