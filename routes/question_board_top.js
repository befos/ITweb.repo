var express = require('express');
var router = express.Router();
var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    var u = url.parse(req.url, false);
    var error = req.session.error_status;　
    req.session.error_status = 0;
    if (req.session.user_id) {
        res.locals = template.common.true;//varからここまででテンプレートに代入する値を入れている
        res.render('qna', {userName: req.session.user_id,
                            error:error,reqCsrf:req.csrfToken()
                            });
    } else {
        res.locals = template.common.false;
        res.render('qna',{error:error,
                            reqCsrf:req.csrfToken()
                        });
    }
});

module.exports = router;
