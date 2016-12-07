var express = require('express');
var router = express.Router();

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

router.get('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata');
    var id = req.session.user_id;
    User.update({uid:id},{$set:{ac_use:false}},function(err){
        if(err) return hadDbError(err, req, res);
        if(!err){
            req.session.destroy();
            res.redirect('/');
            mongoose.disconnect();
        }
    });
});

function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/toppage');
    mongoose.disconnect();
}


module.exports = router;
