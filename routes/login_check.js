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
    if (req.body.id !== null && req.body.password !== null) {
        var id = req.body.id; // login.ejsのformから飛ばされた情報を受け取って変数に格納
        var password = req.body.password; //上と同じ
        User.find({_id: id}, function(err, result) {
                if (result) {
                    if (result.length === 0) {//同じ_idが無い場合はDB上にデータが見つからないので0
                        console.log("nosuch"); //見つからなかった場合の処理（認証フェーズへ）
                        User.find({uid: id}, function(err, result) {
                            if (result) {
                                if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                                    req.session.error_status = 2;
                                    res.redirect('/login');
                                    mongoose.disconnect();
                                } else {
                                    //uidが見つかった
                                    console.log("such uid");
                                    //認証フェーズ
                                    var dbpass = result[0].hashpass;
                                    var salt = result[0].salt;
                                    var passhash = createhash.method(password, salt, STRETCH);
                                    if (dbpass === passhash) {
                                        req.session.error_status = 0;
                                        req.session.user_id = id;
                                        res.redirect('/');
                                        mongoose.disconnect();
                                    } else {
                                        //IDは見つかったがパスワードが一致しない
                                        req.session.error_status = 2;
                                        res.redirect('/login');
                                        mongoose.disconnect();
                                    }
                                }
                            }
                        });
                    } else {//Emailaddressが見つかった
                        console.log("such Emailaddress");
                        var dbpass = result[0].hashpass;
                        var salt = result[0].salt;
                        var passhash = createhash.method(password, salt, STRETCH);
                        //認証フェーズ
                        if (dbpass === passhash) {
                            req.session.error_status = 0;
                            req.session.user_id = id;
                            res.redirect('/');
                            mongoose.disconnect();
                        } else {
                            //IDは見つかったがパスワードが一致しない
                            req.session.error_status = 2;
                            res.redirect('/login');
                            mongoose.disconnect();
                        }
                    }
                  }
        });
    } else {
        res.redirect('/login');//フォームに情報が欠けているのでリダイレクト
        mongoose.disconnect();
    }
});


module.exports = router;
