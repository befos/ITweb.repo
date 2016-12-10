var express = require('express');
var router = express.Router();
var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    console.log(req.session.error_status);
    req.session.error_status = 0;
    if (req.session.user_id) {
        res.locals = template.common.true;//共通なテンプレートに読み込む
        res.render('toppage', {userName: req.session.user_id,reqCsrf:req.csrfToken()});
    } else {
        res.locals = template.common.false;//共通なテンプレートに読み込む
        res.render('toppage', {reqCsrf:req.csrfToken()});
    }
});

module.exports = router;
