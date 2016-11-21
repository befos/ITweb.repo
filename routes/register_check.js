var express = require('express');
var router = express.Router();

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

router.post('/', function(req, res, next) {
      if (req.body.id !== null && req.body.password !== null && req.body.Email !== null) {
                mongoose.connect('mongodb://localhost:27017/userdata');
                var id = req.body.id; //formから飛ばされた情報を受け取って変数に格納
                var password = req.body.password; //上と同じ
                var confirm_password = req.body.confirm_password;
                var Email = req.body.Email;
                if (password != confirm_password) {
                    //ポストされたパスワードが一致しない
                    req.session.error_status = 1;
                    res.redirect('/register');
                    mongoose.disconnect();
                }
                User.find({_id: Email}, function(err, result) {
                        if (result) {
                            if (result.length === 0) {//同じ_idが無い場合はDB上にデータが見つからないので0
                                console.log("nosuch"); //見つからなかった場合の処理（新規作衛）
                                User.find({uid: id}, function(err, result) {
                                    if (result) {
                                        if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                                            req.session.error_status = 0;
                                            res.render('register_check', {
                                                id: id,
                                                password: password,
                                                email: Email,
                                                reqCsrf: req.csrfToken()
                                            });
                                            mongoose.disconnect();
                                        } else {
                                            //uidがかぶっているのでリダイレクト
                                            console.log("such uid");
                                            req.session.error_status = 2;
                                            res.redirect('/register');
                                            mongoose.disconnect();
                                        }
                                    }
                                });
                            }else{
                                console.log("suchdoc Removepage");
                                req.session.error_status = 2;
                                res.redirect('/register');
                                mongoose.disconnect();
                            }
                        }
                        if(err){
                            console.log(err);
                            req.session.error_status = 6;
                            res.redirect('/register');
                            mongoose.disconnect();
                        }
                });
        } else {
              res.redirect('/register'); //もし（多分無いが）送られてきたフォームの要素が欠けていたら
              mongoose.disconnect();
      }
});

        module.exports = router;
