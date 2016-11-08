var express = require('express');
var router = express.Router();

// ページを追加する(静的コンテンツの追加)
router.get('/', function(req, res, next) {
  res.render('mypage');
});

module.exports = router;
