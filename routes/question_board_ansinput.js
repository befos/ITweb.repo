var express = require('express');
var router = express.Router();
var url = require('url');
var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    /*この下からページのレンダー処理*/
    var u = url.parse(req.url, false);
    var obj_id = u.query;
    var error = req.session.error_status;
    req.session.error_status = 0;
    req.session.foid = obj_id;
    if (req.session.user_id) {
        res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
        res.render('qna_ansinput', {
            userName: req.session.user_id,
            error: error,
            reqCsrf: req.csrfToken(),
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
