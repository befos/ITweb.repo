var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var routes = require('./routes/index.js');

var app = express();

// サーバーの起動を告知
console.log('Example app listening at http://localhost');

// view engine setup
app.set('views', path.join(__dirname, 'views'));　//joinは結合（__dirnameはソースが入っているディレクトリを表す）
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//ページを追加する場合に追加で記述
app.use('/', routes.home);//ページへのルートを記す(新規追加の場合はindex.jsファイル内の配列に追加)
app.use('/users', routes.users);
app.use('/hoge', routes.hoge);
app.use('/login', routes.login);
app.use('/login_check', routes.login_check);

//ログイン処理

// 404が返ってきた場合の処理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app; // bin/wwwファイルなどで
