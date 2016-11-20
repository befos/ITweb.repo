var express = require('express');
var router = express.Router();

// ページを追加する(静的コンテンツの追加)
router.get('/', function(req, res, next) {
    if (req.session.user_id) {//セッションにユーザIDが格納されているかを判定
      res.render('mypage');
    } else {
      res.redirect('/login');//ログインしてないのでログイン画面にリダイレクト
    }
});

module.exports = router;
