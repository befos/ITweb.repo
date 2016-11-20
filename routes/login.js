var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.session.error_status);
    //res.sendFile(process.cwd() + "/public/login.html"); //静的コンテンツの参照(絶対パス)
    if (req.session.user_id) {
        res.redirect('/mypage'); //ログイン済みなのでリダイレクト
    } else {
        res.render('login', {reqCsrf: req.csrfToken()
        });
    }
});

module.exports = router;
