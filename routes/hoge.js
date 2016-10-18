var express = require('express');
var router = express.Router();

// ページを追加する
router.get('/', function(req, res, next) {
  res.sendFile(process.cwd() + "/public/hoge.html"); //静的コンテンツの参照
});

module.exports = router;
