var express = require('express');
var router = express.Router();
var randword = require('../public/javascripts/randword.js').randword;
var createhash = require('../public/javascripts/createhash.js').createhash;

var STRETCH = 10000;

//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata');//スコープの設定(この状態だとuserdataにスコープがある)

router.post('/', function(req, res, next) {
 if(req.body.id !== null && req.body.password !== null){
   var id = req.body.id; // public/login.htmlのformから飛ばされた情報を受け取って変数に格納
   var password = req.body.password; //上と同じ
   userdata.get(id,function(err, jsonobj) { //フォームに入力されたIDと同名のドキュメントをコレクションuserdataから探してくる
    if(err){//見つからなかった場合の処理
      res.redirect('/login');
    }
    if (!err) { //見つかった場合
      var dbpass =  jsonobj.hashpass;//jsonオブジェクトからhashpassを参照し変数に格納
      var salt = jsonobj.salt;
      var passhash = createhash.method(password, salt, STRETCH);
      if(dbpass === passhash){
        res.redirect('/');
      }else{
        res.redirect('/login');
      }
    }
 });
 }else{
   res.redirect('/login');
}
});


module.exports = router;
