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
var conf = require('../config/commonconf.json');
var insert = require('../config/template.json');//テンプレートの読み込み

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

var URL = conf.sendmailconf.url1; //メール認証用のURL
var MINUTES = conf.sendmailconf.minute; //数字でURLが有効な分数を指定

/*------------rateover-------------*/
/*総当たり攻撃対策*/
var request = conf.rateoverconf4.request;
var duration = conf.rateoverconf4.duration;
var use = conf.rateoverconf4.use;
var limiter = new RateLimiter(request, duration, use); //総当たり攻撃を防ぐための設定（ここでは1時間当たり150リクエストまで）
/*---------------------------------*/

router.post('/', function(req, res, next) {
    limiter.removeTokens(1, function(err, remainingRequests) {
        if (remainingRequests > 0) { //formから飛ばされた情報を受け取って変数に格納
            //mongoose.connect('mongodb://localhost:27017/userdata');
            //formから飛ばされた情報を受け取って変数に格納
            var email = req.body.id;
            var url_pass = sha256(randword.method(16));
            var mailOptions = { //メールの送信内容
                from: 'Stichies運営<stichies01@gmail.com>',
                to: email,
                subject: 'パスワードのリセットについて',
                html: '以下のURLからパスワードのリセットを行ってください。<br>' +
                    'URLの有効時間は' + MINUTES + '分間です。<br>' +
                    '有効時間後は再度パスワードのリセットを行ってください。<br>' +
                    URL + url_pass + '<br><br>'
            };
            User.find({
                email: email
            }, function(err, result) {
                if (err) return hadDbError(err, res, req);
                if (result) {
                    if (result.length === 0) {
                        return hadInputdataError(req, res);
                    } else {
                        var dbemail = result[0].email;
                        var dt = new Date();
                        dt.setMinutes(dt.getMinutes() + MINUTES);
                        var regentime = dt.toFormat("YYYY/MM/DD HH24:MI:SS"); //時間を取得
                        console.log(regentime);
                        User.update({
                            email: dbemail
                        }, {
                            $set: {
                                ac_reset: true,
                                url_pass: url_pass,
                                regent: regentime
                            }
                        }, function(err) {
                            if (err) return hadError(err, res, req);
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
                                    }
                                    transporter.close(); //SMTPの切断
                                });
                                req.session.error_status = 0;
                                res.render('password_reset_mail');
                                mongoose.disconnect();
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
    res.redirect('/password_reset');
    mongoose.disconnect();
}

function hadSendmailError(err, req, res, resp) {
    console.log(err);
    req.session.error_status = 4;
    res.redirect('/password_reset');
    mongoose.disconnect();
}

function hadDbError(err, res, req) {
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/password_reset');
    mongoose.disconnect();
}

function hadRateoverError(err, req, res) {
    //req.session.error_status = 13;
    req.session.destroy();
    res.locals = insert.passwdresetrateover;
    res.render('RedirectError');
    mongoose.disconnect();
}


module.exports = router;
