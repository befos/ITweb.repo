var express = require('express');
var router = express.Router();

// ページを追加する(静的コンテンツの追加)
router.get('/', function(req, res, next) {
  res.sendFile(process.cwd() + "/public/homepage.html"); //静的コンテンツの参照(絶対パス)
});

module.exports = router;
