var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //res.sendFile(process.cwd() + "/public/login.html"); //静的コンテンツの参照(絶対パス)
  res.render('login');
});

module.exports = router;
