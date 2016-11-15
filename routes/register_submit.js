var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;
var sha256 = require('js-sha256');
var mailer = require('nodemailer');
var ejs = require('ejs');
require('date-utils');
var generator = require('xoauth2').createXOAuth2Generator({//googleの認証用
    user: 'stichies01@gmail.com',
    clientId: '1096218509599-63cs90qmsvdg5v8to44cn3tgl4ni0c9o.apps.googleusercontent.com',
    clientSecret: 'XMkfmFGd2Iv1jBWNgvmjUxsf',
    refreshToken: '1/gSZzfoVBTjXr1IE-ah-n7mA3aLl3RulrQHItdoznRkw',
});


//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata'); //スコープの設定(この状態だとuserdataにスコープがある)

var STRETCH = 10000; //パスワードをストレッチする際の回数
var URL = 'http://localhost:8080/register_confirm?';//メール認証用のURL

generator.on('token', function(token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
});

router.post('/', function(req, res, next) {
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
    userdata.get(email, function(err) { //フォームに入力されたIDと同名のドキュメントをコレクションuserdataから探してくる
        if (err) {
            console.log("nosuch"); //見つからなかった場合の処理（新規作衛）
            userdata.view('uid', 'userserch', {
                keys: [id]
            }, function(err, doc) {
                if (!err) {
                    var array = doc.rows; //viewで返されたJsonobjをarrayに入れる
                    if (array.length === 0) { //同じuidが無い場合はDB上にデータが見つからないので0
                        req.session.error_status = 0;
                        var dt = new Date();
                        var regetime = dt.toFormat("YYYY/MM/DD HH24:MI:SS");//時間を取得
                        console.log(regetime);
                        userdata.insert({
                            _id: email,
                            uid: id,
                            prop: null,
                            hashpass: passhash,
                            salt: salt,
                            url_pass: url_pass,
                            regetime: regetime,
                            changepasstime: null,
                            account_status: false
                        }, function(err, body) {
                            if (!err) {
                                console.log(body);//この下からメールを送信する処理
                                var transporter = mailer.createTransport(({ //SMTPの接続
                                    service: 'gmail',
                                    auth: {
                                        xoauth2: generator
                                    }
                                }));
                                transporter.sendMail(mailOptions, function(err, res) { //メールの送信
                                    if (err) { //送信に失敗したとき
                                        console.log(err);
                                    }
                                    if (!err) { //送信に成功したとき
                                        console.log('Message sent');
                                    }
                                    transporter.close(); //SMTPの切断
                                });
                                res.render('register_submit');
                            }
                        });
                    } else {
                        //uidがかぶっているのでリダイレクト
                        req.session.error_status = 2;
                        res.redirect('/register');
                    }
                }
            });
        }
        if (!err) { //見つかった場合(リダイレクト)
            console.log("suchdoc Removepage");
            req.session.error_status = 2;
            res.redirect('/register');
        }
    });
});

module.exports = router;
