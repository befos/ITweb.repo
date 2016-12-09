var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(req.session.user_id){
        var insert = {
            userName:req.session.user_id,
            login:'マイページ'
        };
        res.locals = insert;//テンプレートに読み込む
        res.render('contact');
    }else{
        var insert = {
            userName:'ゲスト',
            login:'ログイン'
        };
        res.locals = insert;//テンプレートに読み込む
        res.render('contact');
    }
});

module.exports = router;
