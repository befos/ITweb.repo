var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.user_id) {
        res.render('qna', {userName: req.session.user_id ,login:'マイページ',reqCsrf: req.csrfToken()});
    } else {
        res.render('qna', {userName:'ゲスト', login:'ログイン',reqCsrf: req.csrfToken()});
    }
});

module.exports = router;
