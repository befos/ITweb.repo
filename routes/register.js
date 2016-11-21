var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log(req.session.error_status);
  res.render('register', {reqCsrf:req.csrfToken()});
});

module.exports = router;
