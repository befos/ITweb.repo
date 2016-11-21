var express = require('express');
var router = express.Router();

// ページを表示する(静的コンテンツの追加)
router.get('/', function(req, res, next) {
    res.render('toppage');
});

module.exports = router;
