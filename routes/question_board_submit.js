var express = require('express');
var router = express.Router();

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Forum = models.Forum;
var ForumCont = models.ForumCont;

router.post('/', function(req, res, next) {
    //test用
    var foname = "test";
    var host = req.session.user_id;
    var question ='<p>むずすぎぃぃ！！</p>'
    var dummytext = '<p>ほげげ</p>';
    var name = "testユーザー";
    var tag = ["C言語", "難しい"];
    //↑ダミー
    mongoose.connect('mongodb://localhost:27017/userdata');
    var makeforum = new Forum({
        foname: foname,//フォーラムの名前（被りあり）
        host: host,//uid
        count: null,//アクセスされた回数
        uday: null,
        ques: question,
        tag: tag,//多分500要素まで？この中に言語も記述してもらう(ニコ動のタグみたいなもの)
        f_st: true//forumの内容が解決済みか
    });
    makeforum.save(function(err) {//refを使用しているの二重にセーブ
      if(err) return hadDbError(err , req, res);//バリデーションエラーが出る可能性(もし被りが出た場合)
      var makefocont = new ForumCont({
          uid: req.session.user_id,
          name: name,//ユーザーが決めた自由な名前
          prop: null,//プロフィールの画像？
          cuday: null,//コンテンツを上げた日
          chday: null,//内容を編集した日
          text: dummytext//本文
      });
      makefocont.save(function(err){
         if(err) return hadDbError(err, req, res);
        console.log('finish');
        mongoose.disconnect();
      });
    });
});

function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/register');
    mongoose.disconnect();
}

module.exports = router;
