var express = require('express');
var router = express.Router();
var url = require('url');
require('date-utils');

//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata'); //スコープの設定(この状態だとuserdataにスコープがある)

router.get('/', function(req, res, next) {
    var u = url.parse(req.url, false);
    var dt = new Date();
    var regetime = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    console.log(u.query);
    userdata.view('uid', 'finalcheck', {
        keys: [u.query]
    }, function(err, doc) {
        if (!err) {
            var array = doc.rows[0]; //viewで返されたJsonobjをarrayに入れる
            console.log(array["value"]);
            if (array.length === 0) { //見つからない場合は時間切れか未知のエラー
                req.session.error_status = 1;
                res.render('register');
            }else{
                req.session.error_status = 2;
                userdata.get(array["value"], function(err) { //フォームに入力されたIDと同名のドキュメントをコレクションuserdataから探してくる
                    if (err) {
                        console.log("WTF!"); //見つからなかった場合の処理（新規作衛)
                    }
                    if (!err) { //見つかった場合(リダイレクト)
                        console.log("Accitvete account");
                        req.session.error_status = 2;
                        res.render('register_confirm');
                    }
                });
            }
        }
    });
});

module.exports = router;
