var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //res.sendFile(process.cwd() + "/public/login.html"); //静的コンテンツの参照(絶対パス)
  if (req.session.user_id) {
    res.redirect('/');//ログイン済みなのでリダイレクト
  } else {
    res.render('login');
  }
});

module.exports = router;
