var express = require('express');
var router = express.Router();
var randword = require('../public/js/Kfolder/randword.js').randword;
var createhash = require('../public/js/Kfolder/createhash.js').createhash;
var sha256 = require('js-sha256');
require('date-utils');


//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata'); //スコープの設定(この状態だとuserdataにスコープがある)

var STRETCH = 10000; //パスワードをストレッチする際の回数

router.post('/', function(req, res, next) {
    req.session.error_status = 0;
    var id = req.body.id; //formから飛ばされた情報を受け取って変数に格納
    var password = req.body.password; //上と同じ
    var email = req.body.email;
    var salt = randword.method(10);
    var url_pass = sha256(randword.method(32));
    var passhash = createhash.method(password, salt, STRETCH);

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
                        var regetime = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
                        console.log(regetime);
                        userdata.insert({
                            _id: email,
                            uid: id,
                            prop: null,
                            hashpass: passhash,
                            salt: salt,
                            url_pass: url_pass,
                            regetime:regetime,
                            changepass:null
                        }, function(err, body) {
                            if (!err) {
                                console.log(body);
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
