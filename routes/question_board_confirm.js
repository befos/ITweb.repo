var express = require('express');
var router = express.Router();
var template = require('../config/template.json');
　

router.post('/', function(req, res, next){
    //ここでは入力されたタグのエスケープ処理などを行うこと
    var title = req.body.input_title;
    var tag = [];
    var chkbox =[//チェックボックスのデータを受け取り配列に格納
            req.body.q1,
            req.body.q2,
            req.body.q3,
            req.body.q4,
            req.body.q5,
            req.body.q6,
            req.body.q7,
            req.body.q8
    ];
    for(var i = 0; chkbox.length > i; i++){//チェックボックス判定
        if(chkbox[i] !== undefined){
            tag.push(chkbox[i]);
        }
    }
    console.log(tag);
    var cont = req.body.input;
    var error = req.session.error_status;
    var hostid = req.session.obj_id;
    var host = req.session.user_id;
    req.session.tag = tag;
    req.session.error_status = 0;
    if (req.session.user_id) {
        res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
        res.render('qna_confirm', {
            userName: req.session.user_id,
            error: error,
            reqCsrf: req.csrfToken(),
            title:title,
            cont:cont,
            hostid:hostid,
            host:host
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
