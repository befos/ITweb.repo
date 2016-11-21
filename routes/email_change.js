var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.session.error_status);
    res.render('email_change', {reqCsrf:req.csrfToken()});
});

module.exports = router;
