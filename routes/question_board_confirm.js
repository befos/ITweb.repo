var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('/login');
});

router.post('/', function(req, res, next){
    var dummy = '<p>hogehoge</p>';
    console.log(dummy);

});

module.exports = router;
