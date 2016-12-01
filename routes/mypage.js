var express = require('express');
var router = express.Router();

// ページを追加する(静的コンテンツの追加)
router.get('/', function(req, res, next){
    res.render('ckeditor', {reqCsrf:req.csrfToken()});
});

router.post('/', function(req, res, next) {
    var test = req.body.editor1;
    var posttest = req.body.posttest;
    console.log(test);
    console.log(posttest);
});

module.exports = router;
