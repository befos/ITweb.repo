var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;
var sha256 = require('js-sha256');
var mailer = require('nodemailer');　
var generator = require('xoauth2').createXOAuth2Generator({ //googleの認証用
    user: 'stichies01@gmail.com',
    clientId: '1096218509599-63cs90qmsvdg5v8to44cn3tgl4ni0c9o.apps.googleusercontent.com',
    clientSecret: 'XMkfmFGd2Iv1jBWNgvmjUxsf',
    refreshToken: '1/gSZzfoVBTjXr1IE-ah-n7mA3aLl3RulrQHItdoznRkw',
});
var RateLimiter = require('limiter').RateLimiter;

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

var insert = require('../config/template.json');//テンプレートの読み込み
var conf = require('../config/commonconf.json'); //共通設定の読み込みｆ

var URL = conf.sendmailconf.url2; //メール認証用のURL
var MINUTES = conf.sendmailconf.minute; //数字でURLが有効な分数を指定

/*------------rateover-------------*//*総当たり攻撃対策*/
var request = conf.rateoverconf.request;
var duration = conf.rateoverconf.duration;
var use = conf.rateoverconf.use;
var limiter = new RateLimiter(request, duration, use); //総当たり攻撃を防ぐための設定（ここでは1時間当たり150リクエストまで）
/*---------------------------------*/

router.post('/', function(req, res, next) {
    limiter.removeTokens(1, function(err, remainingRequests) {
        if (remainingRequests > 0) {//formから飛ばされた情報を受け取って変数に格納
            mongoose.connect('mongodb://localhost:27017/userdata');
            var email = req.body.id;
            var obj_id = req.session.obj_id;
            var url_pass = sha256(randword.method(16));
            var mailOptions = { //メールの送信内容
                from: 'Stichies運営<stichies01@gmail.com>',
                to: email,
                subject: 'メールアドレスの変更について',
                html: '以下のURLからメールアドレスの変更を行ってください。<br>' +
                    'URLの有効時間は' + MINUTES + '分間です。<br>' +
                    '有効時間後は再度メールアドレスの変更を行ってください。<br>' +
                    URL + url_pass + '<br><br>'
            };
            User.find({_id: obj_id}, function(err, result) {
                if (err) return hadDbError(err, res, req);
                if (result) {
                    if (result.length === 0) {
                        return hadInputdataError(req, res);
                    } else {
                        if (result[0].email == email) {//変更後と変更前が同じ場合
                            return hadInputdataError(req, res);
                        }
                        var dt = new Date();
                        dt.setMinutes(dt.getMinutes() + MINUTES);
                        var ect = dt.toFormat("YYYY/MM/DD HH24:MI:SS"); //時間を取得
                        console.log(ect);
                        User.update({_id: obj_id}, {
                            $set: {
                                ac_ec: true,
                                url_pass: url_pass,
                                ect: ect,
                                cemail: email
                            }
                        }, function(err) {
                            if (err) return hadDbError(err, res, req);
                            if (!err) {
                                //この下からメールを送信する処理
                                var transporter = mailer.createTransport(({ //SMTPの接続
                                    service: 'gmail',
                                    auth: {
                                        xoauth2: generator
                                    }
                                }));
                                transporter.sendMail(mailOptions, function(err, resp) { //メールの送信
                                    if (err) { //送信に失敗したとき
                                        return hadSendmailError(err, req, res, resp);
                                    }
                                    if (!err) { //送信に成功したとき
                                        console.log('Message sent');
                                        res.render('email_change_mail');
                                        mongoose.disconnect();
                                        transporter.close(); //SMTPの切断
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            return hadRateoverError(err, req, res);
        }
    });
});

//エラーハンドル
function hadInputdataError(req, res) {
    req.session.error_status = 1;
    res.redirect('/email_change');
    mongoose.disconnect();
}

function hadOverlapError(req ,res){
    req.session.error_status = 2;
    res.redirect('/register');
    mongoose.disconnect();
}

function hadSendmailError(err, req, res, resp) {
    console.log(err);
    req.session.error_status = 4;
    res.redirect('/email_change');
    transporter.close(); 
    mongoose.disconnect();
}

function hadDbError(err, res, req) {
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/email_change');
    mongoose.disconnect();
}

function hadRateoverError(err, req, res) {
    //req.session.error_status = 13;
    res.locals = insert.emailchrateover;
    res.render('RedirectError');
    mongoose.disconnect();
}

module.exports = router;
