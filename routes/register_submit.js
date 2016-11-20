var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;
var sha256 = require('js-sha256');
var mailer = require('nodemailer');
require('date-utils');
var generator = require('xoauth2').createXOAuth2Generator({//googleの認証用
    user: 'stichies01@gmail.com',
    clientId: '1096218509599-63cs90qmsvdg5v8to44cn3tgl4ni0c9o.apps.googleusercontent.com',
    clientSecret: 'XMkfmFGd2Iv1jBWNgvmjUxsf',
    refreshToken: '1/gSZzfoVBTjXr1IE-ah-n7mA3aLl3RulrQHItdoznRkw',
});

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

var STRETCH = 10000; //パスワードをストレッチする際の回数
var URL = 'http://localhost:8080/register_confirm/?';//メール認証用のURL

generator.on('token', function(token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
});

router.post('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata');
    req.session.error_status = 0;
    var id = req.body.id; //formから飛ばされた情報を受け取って変数に格納
    var password = req.body.password; //上と同じ
    var email = req.body.email;
    var salt = randword.method(10);
    var url_pass = sha256(randword.method(16));
    var passhash = createhash.method(password, salt, STRETCH);
    var mailOptions = { //メールの送信内容
        from: 'Stichies運営<stichies01@gmail.com>',
        to: email,
        subject: 'Stichies本登録について',
        html: '以下のアドレスからアカウトを有効にしてください。<br>' +
            'アドレスの有効時間は10分間です。<br>' +
            '有効時間後はアカウントの作り直しを行ってください。<br>' +
            URL + url_pass + '<br><br>'
    };
    User.find({_id: email}, function(err, result) {
            if (result) {
                if (result.length === 0) {//同じ_idが無い場合はDB上にデータが見つからないので0
                    console.log("nosuch"); //見つからなかった場合の処理（新規作衛）
                    User.find({uid: id}, function(err, result) {
                        if (result) {
                            if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                                var dt = new Date();
                                var regetime = dt.toFormat("YYYY/MM/DD HH24:MI:SS");//時間を取得
                                console.log(regetime);
                                var onetimeuser = new User({
                                  _id: email,
                                  uid: id,
                                  age: null,
                                  sex: null,
                                  work: null,
                                  prop: null,
                                  uf_pl: null,
                                  place: null,
                                  hashpass: passhash,
                                  salt: salt,
                                  url_pass: url_pass,
                                  regest: regetime,
                                  chpst: null,
                                  ac_st: false,
                                  ac_use: false,
                                  ac_reset: false
                                });
                                onetimeuser.save(function(err) {
                                  if(!err){
                                    //この下からメールを送信する処理
                                    var transporter = mailer.createTransport(({ //SMTPの接続
                                        service: 'gmail',
                                        auth: {
                                            xoauth2: generator
                                        }
                                    }));
                                    transporter.sendMail(mailOptions, function(err, res) { //メールの送信
                                        if (err) { //送信に失敗したとき
                                            console.log(err);
                                            res.redirect('/register');
                                            req.session.error_status = 4;
                                            mongoose.disconnect();
                                        }
                                        if (!err) { //送信に成功したとき
                                            console.log('Message sent');
                                        }
                                        transporter.close(); //SMTPの切断
                                    });
                                    res.render('register_submit');
                                    req.session.error_status = 0;
                                    mongoose.disconnect();
                                  }
                                });
                            } else {
                                //uidがかぶっているのでリダイレクト
                                console.log("such uid");
                                req.session.error_status = 2;
                                res.redirect('/register');
                                mongoose.disconnect();
                            }
                        }
                    });
                } else {
                    console.log("suchdoc Removepage");
                    req.session.error_status = 2;
                    res.redirect('/register');
                    mongoose.disconnect();
                }
            }
    });
});

module.exports = router;
