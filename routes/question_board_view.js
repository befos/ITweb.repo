var express = require('express');
var router = express.Router();
var url = require('url');

//検索結果画面

router.get('/', function(req, res, next) {
    var u = url.parse(req.url, false);
    console.log(u.query);
});

module.exports = router;
