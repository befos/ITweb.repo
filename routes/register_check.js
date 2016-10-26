var express = require('express');
var router = express.Router();

//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata');//スコープの設定(この状態だとuserdataにスコープがある)

router.post('/', function(req, res, next) {
 if(req.body.id !== null && req.body.password !== null && req.body.Email !== null){
   var id = req.body.id; //formから飛ばされた情報を受け取って変数に格納
   var password = req.body.password; //上と同じ
   var EmailHead = req.body.Email;
   var Email = EmailHead + "@st.kobedenshi.ac.jp";//メールアドレスドメインと合体
   //ドキュメントを挿入する前にパスワードのソルト&ハッシュ化を済ませてしまう
   userdata.get(Email,function(err, jsonobj) { //フォームに入力されたIDと同名のドキュメントをコレクションuserdataから探してくる
    if(err){
      console.log("nosuch");//見つからなかった場合の処理（新規作衛）
      userdata.insert({ _id:Email , uid:id, prop:null, inout:null,
          hashpass:password, salt:'rand'}, function(err, body) {
        if (!err)
        console.log(body);
        res.redirect('/succes');
      });
    }
    if (!err) { //見つかった場合(リダイレクト)
      console.log("suchdoc Removepage");
      res.redirect('/register');
    }
 });
 }else{
   res.redirect('/register'); //もし（多分無いが）送られてきたフォームの要素が欠けていたら
}
});


module.exports = router;
