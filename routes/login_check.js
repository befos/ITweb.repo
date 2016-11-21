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
        User.find({email: id}, function(err, result) {
                if(err) return hadDbError(err, req, res);
                if (result) {
                    if (result.length === 0) {//同じ_idが無い場合はDB上にデータが見つからないので0
                        console.log("nosuch"); //見つからなかった場合の処理（認証フェーズへ）
                        User.find({uid: id}, function(err, result) {
                            if(err) return hadDbError(err, req, res);
                            if (result) {
                                if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                                    req.session.error_status = 1;
                                    res.redirect('/login');
                                    mongoose.disconnect();
                                } else {
                                    //uidが見つかった
                                    console.log("such uid");
                                    //認証フェーズ
                                    var dbpass = result[0].hashpass;
                                    var salt = result[0].salt;
                                    var account_status = result[0].ac_st;
                                    var passhash = createhash.method(password, salt, STRETCH);
                                    if (dbpass === passhash) {
                                        req.session.error_status = 0;
                                        req.session.user_id = result[0].uid;
                                        res.redirect('/mypage');
                                        mongoose.disconnect();
                                    } else {
                                        //IDは見つかったがパスワードが一致しない
                                        return hadInputdataError(req, res);
                                    }
                                }
                            }
                        });
                    } else {//Emailaddressが見つかった
                        console.log("such Emailaddress");
                        var dbpass = result[0].hashpass;
                        var salt = result[0].salt;
                        var account_status = result[0].ac_st;
                        var passhash = createhash.method(password, salt, STRETCH);
                        //認証フェーズ
                        if (dbpass === passhash && account_status === true) {
                            req.session.error_status = 0;
                            req.session.user_id = id;
                            res.redirect('/mypage');
                            mongoose.disconnect();
                        } else {
                            //IDは見つかったがパスワードが一致しない
                            return hadInputdataError(req, res);
                        }
                    }
                  }
        });
    } else {
        return hadInputdataError(req, res);
    }
});

//エラーハンドル
function hadInputdataError(req, res){
    req.session.error_status = 1;
    res.redirect('/login');
    mongoose.disconnect();
}

function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/login');
    mongoose.disconnect();
}


module.exports = router;
