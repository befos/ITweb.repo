var express = require('express');
var router = express.Router();

//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata'); //スコープの設定(この状態だとuserdataにスコープがある)


router.post('/', function(req, res, next) {
    if (req.body.id !== null && req.body.password !== null && req.body.Email !== null) {
        var id = req.body.id; //formから飛ばされた情報を受け取って変数に格納
        var password = req.body.password; //上と同じ
        var confirm_password = req.body.confirm_password;
        var Email = req.body.Email;
        if (password != confirm_password) {
            //ポストされたパスワードが一致しない
            req.session.error_status = 1;
            res.redirect('/register');
        }
        userdata.get(Email, function(err) { //フォームに入力されたIDと同名のドキュメントをコレクションuserdataから探してくる
            if (err) {
                console.log("nosuch"); //見つからなかった場合の処理（新規作衛）
                userdata.view('uid', 'userserch', {
                    keys: [id]
                }, function(err, doc) {
                    if (!err) {
                        var array = doc.rows; //viewで返されたJsonobjをarrayに入れる
                        if (array.length === 0) { //同じuidが無い場合はDB上にデータが見つからないので0
                            req.session.error_status = 0;
                            res.render('register_check', {
                                id: id,
                                password: password,
                                email: Email,
                                reqCsrf: req.csrfToken()
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
    } else {
        res.redirect('/register'); //もし（多分無いが）送られてきたフォームの要素が欠けていたら
    }
});

module.exports = router;
