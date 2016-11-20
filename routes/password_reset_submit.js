var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

var STRETCH = 10000; //パスワードをストレッチする際の回数


router.post('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata');
    req.session.error_status = 0;
    //formから飛ばされた情報を受け取って変数に格納
    var password = req.body.password; //上と同じ
    var salt = randword.method(10);
    var passhash = createhash.method(password, salt, STRETCH);
    var uid = req.session.one_shot_id;
    User.find({uid:uid},function(err,result){
        if(result){
            if (result.length === 0) {
                console.log("nosuch"); //見つからなかった場合の処理(時間外)
                req.session.error_status = 5;
                res.redirect('/password_reset');
                mongoose.disconnect();
            }else{
                if(result[0].ac_reset !== true){
                    req.session.error_status = 5;
                    res.redirect('/password_reset');
                    mongoose.disconnect();
                }
                User.update({uid:uid},{$set:{hashpass:passhash,ac_reset:false,salt:salt}},function(err){
                    if(!err){
                        req.session.one_shot_id = null;
                        res.render('password_reset_submit');
                        mongoose.disconnect();
                    }
                });
            }
            if(err){
                mongoose.disconnect();
            }
        }
    });
});

module.exports = router;
