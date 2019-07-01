const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const profile = require('./routes/profile');
const users = require('./routes/users');
const {SECRET_KEY} = require('./config');
const register = require('./routes/register');
const login = require('./routes/login');
const goods = require('./routes/goods');
const trades = require('./routes/trades');
const message = require('./routes/message');
const info = require('./routes/info');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', expressJWT({secret: SECRET_KEY}).unless({path: ['/api/auth', '/api/register']}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      status: 'error',
      data: {},
      message: "Token is invalid"
    });
  }
});

app.use('/api/auth', login);

app.use('/api/register', register);

app.use('/api/profile', profile);

app.use('/api/user', users);

app.use('/api/goods', goods);

app.use('/api/trades', trades);

app.use('/api/message', message);

app.use('/api/info', info);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    status: 'error',
    data: {},
    message: err.message
  });
});

module.exports = app;
