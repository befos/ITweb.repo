var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.session.error_status);
    req.session.error_status = 0;
    if (req.session.user_id) {
        res.render('email_change', {reqCsrf:req.csrfToken()});
    }else{
        res.redirect('/');
    }
});

module.exports = router;
