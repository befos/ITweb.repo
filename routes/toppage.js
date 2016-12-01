var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.user_id) {
        res.render('toppage', {userName: req.session.user_id,login:'マイページ' ,reqCsrf:req.csrfToken()});
    } else {
        res.render('toppage', {userName:'ゲスト',login:'ログイン', reqCsrf:req.csrfToken()});
    }
});

module.exports = router;
