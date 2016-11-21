var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;
var sha256 = require('js-sha256');
var mailer = require('nodemailer');
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

var URL = 'http://localhost:8080/email_change_task?';//メール認証用のURL

generator.on('token', function(token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
});

router.post('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata');
    req.session.error_status = 0;
    //formから飛ばされた情報を受け取って変数に格納
    var email = req.body.id;
    var uid = req.body.uid;
    var url_pass = sha256(randword.method(16));
    var mailOptions = { //メールの送信内容
        from: 'Stichies運営<stichies01@gmail.com>',
        to: email,
        subject: 'メールアドレスの変更について',
        html: '以下のアドレスからメールアドレスの変更を行ってください。<br>' +
            'アドレスの有効時間は10分間です。<br>' +
            '有効時間後は再度パスワードのリセットを行ってください。<br>' +
            URL + url_pass + '<br><br>'
    };
    User.find({uid:uid},function(err, result){
      if(result){
          if (result.length === 0) {
              req.session.error_status = 1;//入力されたメールアドレスは存在しません
              res.redirect('/password_reset');
              mongoose.disconnect();
          }else{
              if(result[0].ac_reset === true){
                  req.session.error_status = 4;
                  res.redirect('/password_reset');
                  mongoose.disconnect();
              }
              var dbemail = result[0].email;
              User.update({email:dbemail}, {$set:{ac_reset:true}},function(err){
                  if(!err){
                      User.update({email:dbemail},{$set:{url_pass:url_pass}},function(err){
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
                                res.redirect('/password_reset');
                                req.session.error_status = 4;
                                mongoose.disconnect();
                            }
                            if (!err) { //送信に成功したとき
                                console.log('Message sent');
                            }
                            transporter.close(); //SMTPの切断
                            });
                            res.render('password_reset_mail');
                            mongoose.disconnect();
                        }
                      });
                  }
              });
          }
      }
      if(err){
          console.log(err);
          req.sessin.error_status = 6;
          res.redirect('/password_reset');
          mongoose.disconnect();
      }
    });
});

module.exports = router;
