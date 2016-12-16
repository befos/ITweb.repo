var express = require('express');
var router = express.Router();

//検索結果画面
 
router.get('/', function(req, res, next) {

});

router.post('/', function(req, res, next) {
    posttest = req.body.search;
    console.log(posttest);
});

module.exports = router;
