var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('success', { title: '登録完了。やったぜ' });
});

module.exports = router;
