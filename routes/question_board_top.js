var express = require('express');
var router = express.Router();
var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    if (req.session.user_id) {
        res.locals = template.common.true;//varからここまででテンプレートに代入する値を入れている

        res.render('qna', {userName: req.session.user_id});
    } else {
        res.locals = template.common.false;
        res.render('qna');
    }
});

module.exports = router;
