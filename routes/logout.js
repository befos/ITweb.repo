var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.user_id) {
    delete req.session.user_id;
    res.render('logout');//ログイン済みなのでリダイレクト
  } else {
    res.redirect('/');//ログインしていないのでリダイレクト
  }
});

module.exports = router;
