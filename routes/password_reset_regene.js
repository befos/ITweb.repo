var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;
var sha256 = require('js-sha256');
var url = require('url');
require('date-utils');

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

var STRETCH = 10000; //パスワードをストレッチする際の回数

router.get('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata');
    var u = url.parse(req.url, false);
    var dt = new Date();
    var confirmtime = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    console.log(u.query);
    User.find({url_pass:u.query}, function(err, result) {
            if (result) {
                if (result.length === 0) {//同じ_idが無い場合はDB上にデータが見つからないので0
                    console.log("nosuch"); //見つからなかった場合の処理(時間外)
                    req.session.error_status = 5;
                    res.redirect('/password_reset');
                    mongoose.disconnect();
                } else {
                    //見つかった
                    if(reset === false){
                      req.session.error_status = 3;
                      console.log('WTF!');
                      res.redirect('/password_reset');
                      mongoose.disconnect();
                    }
                    var reset = result[0].ac_reset;
                    req.session.one_shot_id = result[0].uid;
                    res.render('password_reset_regene',{reqCsrf:req.csrfToken()});
                    mongoose.disconnect();
                }
            }
            if(err){
                mongoose.disconnect();
            }
    });
});



module.exports = router;
