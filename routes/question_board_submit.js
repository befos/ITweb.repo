var express = require('express');
var router = express.Router();
require('date-utils');//現在時刻の取得

//データベース接続および設定　
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Forum = models.Forum;
var ForumCont = models.ForumCont;
var conid = mongoose.Types.ObjectId();

router.post('/', function(req, res, next) {
    //test用　
    var foname =　req.body.title;
    var host = req.body.host;
    var hostid = req.body.hostid;
    var question = req.body.cont;
    var tag = req.session.tag;
    var dt = new Date();
    var uday = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
    console.log('connected');
});
    var makeforum = new Forum({
        foname: foname,//フォーラムの名前（被りあり）
        host: host,
        hostid: hostid,//obj_id
        count: null,//アクセスされた回数
        uday: uday,
        ques: question,
        tag: tag,//この中に言語も記述してもらう(ニコ動のタグみたいなもの)
        f_st: true//forumの内容が解決済み...false　初期値はtrue
    });
    makeforum.save(function(err) {//refを使用しているので二重にセーブ
      if(err) return hadDbError(err , req, res);//バリデーションエラーが出る可能性(もし被りが出た場合)
      var makefocont = new ForumCont({
          _id: makeforum._id,
          _conid : conid//回答を保存する回答ページでつける
      });
      makefocont.save(function(err){
         if(err) return hadDbError(err, req, res);
         if(!err) return hadUpload(req, res);
      });
    });
});

function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

function hadUpload(req, res){
    req.session.error_status = 14;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

module.exports = router;
