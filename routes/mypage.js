var express = require('express');
var router = express.Router();

// ページを追加する(静的コンテンツの追加)
router.get('/', function(req, res, next){
    if(req.session.user_id){
        res.render('mypage');
    }else{
        res.redirect('/login');
    }
});

module.exports = router;
