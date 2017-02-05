var express = require('express');
var router = express.Router();
require('date-utils');//現在時刻の取得

//データベース接続および設定　
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Forum = models.Forum;
var ForumCont = models.ForumCont;

router.post('/', function(req, res, next) {
    //test用　
    if(req.session.qbai === true){//二重送信の防止
        return hadUrlError(req, res);
    }
    var foname =　req.body.title;
    var host = req.body.host;
    var hostid = req.body.hostid;
    var question = req.body.cont;
    var dt = new Date();
    var uday = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
    //console.log('connected');
    });
    var makeforum = new Forum({
        foname: foname,//フォーラムの名前（被りあり）
        host: host,
        hostid: hostid,//obj_id
        count: null,//アクセスされた回数
        uday: uday,
        ques: question,
        f_st: true//forumの内容が解決済み...false　初期値はtrue
    });

    //ログインしていなかったらリダイレクトするようにしておく

      var conid = mongoose.Types.ObjectId();
      var makefocont = new ForumCont({
          mfo: req.session.foid,//親のフォーラムidを保存
          _conid : conid,//回答を保存する回答ページでつける
          answer: hostid,
          name: host,
          cuday: uday,
          text:question
      });
      if(req.session.user_id){
          makefocont.save(function(err){
              if(err) return hadDbError(err, req, res);
              if(!err) return hadUpload(req, res);
          });
      }else{
          return hadNotloginError(req, res);
      }
});

function hadUrlError(req ,res){
    req.session.error_status = 5;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

function hadDbError(err, req, res){
    //console.log(err);
    req.session.error_status = 6;
    res.redirect(400, '/question_board_top');
    mongoose.disconnect();
}

function hadNotloginError(req, res) {
    req.session.error_status = 10;
    res.redirect('/login');
    mongoose.disconnect();
}

function hadUpload(req, res){
    req.session.qbai = true;
    req.session.error_status = 14;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

module.exports = router;
