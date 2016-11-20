var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('password_reset', {reqCsrf:req.csrfToken()});
});

module.exports = router;
