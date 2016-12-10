var express = require('express');
var router = express.Router();
var mailer = require('nodemailer');
var generator = require('xoauth2').createXOAuth2Generator({//googleの認証用
    user: 'stichies01@gmail.com',
    clientId: '1096218509599-63cs90qmsvdg5v8to44cn3tgl4ni0c9o.apps.googleusercontent.com',
    clientSecret: 'XMkfmFGd2Iv1jBWNgvmjUxsf',
    refreshToken: '1/gSZzfoVBTjXr1IE-ah-n7mA3aLl3RulrQHItdoznRkw',
});
var template = require('../config/template.json');

router.post('/', function(req, res, next) {
    req.session.error_status = 0;
    //formから飛ばされた情報を受け取って変数に格納
    var name = req.body.name;
    var email = req.body.address;
    var tel = req.body.tel;
    var contents = req.body.contents;
    var mailOptions = { //メールの送信内容
        from: 'Stichies運営<stichies01@gmail.com>',
        to: 'stichies01@gmail.com',
        subject: 'ユーザーからの意見',
        html:'お名前:' + name + '<br>'
            + 'メールアドレス:' + email + '<br>'
            + '電話番号:' + tel + '<br>'
            + '本文:' + contents
    };

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
    res.redirect('/');
    req.session.error_status = 12;
});

//エラーハンドル
function hadSendmailError(err, req, res, resp){
    console.log(err);
    req.session.error_status = 4;
    res.redirect('/contact');
}

module.exports = router;