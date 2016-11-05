var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var ConnectCouchDB = require('connect-couchdb')(session);
var store = new ConnectCouchDB({ //セッション管理用DB接続設定
  name: 'sessiondata',
  username: '',
  password: '',
  host: 'localhost',
});


var routes = require('./routes/index.js');

var app = express();

// サーバーの起動を告知
console.log('Example app listening at http://localhost');

// view engine setup
app.set('views', path.join(__dirname, 'views'));　//joinは結合（__dirnameはソースが入っているディレクトリを表す）
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({         // cookieに書き込むsessionの仕様を定める
  secret: 'ajax-hohoho',               // 符号化。改ざんを防ぐ
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    maxAge: 60 * 60 * 1000 //60s*60m*1000ms ＝ 1day.
  }
}));

//ページを追加する場合に追加で記述
app.use('/', routes.homepage);//ページへのルートを記す(新規追加の場合はindex.jsファイル内の配列に追加)
app.use('/users', routes.users);
app.use('/hoge', routes.hoge);
app.use('/contents', routes.home);
app.use('/login', routes.login);
app.use('/login_check', routes.login_check);
app.use('/register', routes.register);
app.use('/register_check', routes.register_check);
app.use('/logout', routes.logout);
app.use('/success', routes.success);

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
