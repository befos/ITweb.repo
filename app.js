var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connect = require('connect');
var ConnectMongoDB = require('connect-mongo')(session);
var store = new ConnectMongoDB({ //セッション管理用DB接続設定
    url: 'mongodb://localhost:27017/sessiondata',
    ttl: 60 * 60 //1hour
});
var csurf = require('csurf');
var helmet = require('helmet');

var routes = require('./routes/index.js');

var app = express();

// サーバーの起動を告知
console.log('Example app listening at http://localhost:8080');

// view engine setup
app.set('views', path.join(__dirname, 'views'));//joinは結合（__dirnameはソースが入っているディレクトリを表す）
app.set('view engine', 'ejs');


var sess = { // cookieに書き込むsessionの仕様を定める
    secret: 'ajax-hohoho', // 符号化。改ざんを防ぐ
    store: store,
    proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 //60s*60m*1000ms ＝ 1hour.
    }
}
/*
*proxyから送信される内容がhttpsのコンテンツだったらcookieにsecure属性をつける？
*/
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//nginx用の仮想ディレクトリを作成
app.use(session(sess));
app.use(csurf());//セッションとクッキーパーサーの設定後に記述
app.use(helmet());

//ページを追加する場合に追加で記述
app.use('/', routes.toppage); //ページへのルートを記す(新規追加の場合はindex.jsファイル内の配列に追加)
app.use('/contents', routes.home);
app.use('/mypage', routes.mypage);
app.use('/login', routes.login);
app.use('/login_check', routes.login_check);
app.use('/logout', routes.logout);
app.use('/register', routes.register);
app.use('/register_check', routes.register_check);
app.use('/register_submit', routes.register_submit);
app.use('/register_confirm', routes.register_confirm);
app.use('/password_reset', routes.password_reset);
app.use('/password_reset_mail', routes.password_reset_mail);
app.use('/password_reset_regene', routes.password_reset_regene);
app.use('/password_reset_submit', routes.password_reset_submit);
app.use('/email_change', routes.email_change);
app.use('/email_change_mail', routes.email_change_mail);
app.use('/email_change_task', routes.email_change_task);
app.use('/email_change_submit', routes.email_change_submit);
app.use('/question_board_top', routes.question_board_top);
app.use('/question_board', routes.question_board_confirem);
app.use('/question_board_submit', routes.question_board_submit);
app.use('/question_board_view', routes.question_board_view);
app.use('/success', routes.success);



//ミドルウェアを使いつくしたので404を生成
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
