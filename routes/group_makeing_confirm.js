var express = require('express');
var router = express.Router();

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var MGroup = models.MGroup;
var Group = models.Group;

router.post('/', function(req, res, next){
    mongoose.connect('mongodb://localhost:27017/userdata');
    var uid = req.session.user_id;
    var gname = req.body.gname;
    var gid = req.body.gid;
    var place = req.body.place;
    var cate = req.body.cate; //フォームに入寮された情報を持ってくる
    var gmood = req.body.gmood;
    var gintro = req.body.gintro;
    req.session.error_status = 0;//errorステータスの初期化

    var onetimegroup = new Group({
        todoc:place,//結合先から持ってきた都道府県コード
        cgroup:[{//children 子グループを格納する
            gid: gid,//グループにつけるユニークなID
            gname:gname,//グループの名前//被りはあってもいいかな
            host: uid,//グループを作った人
            cate: cate,//カテゴリー（ユーザーには指定させない）(あらかじめ用意したのを使わせる)(追加して欲しい場合は申請してもらう)
            place: place,//活動範囲？
            gmood: gmood,//グループの雰囲気
            gmday: null,//グループを作成した日
            gintro: gintro,//グループ紹介文
            menber: uid,//uidで管理
            g_st: {type:Boolean, default:true}//グループの状態
        }]
    });

    onetimegroup.save(function(err, result){
        if(err){
            if(err.errors.todoc.path == 'todoc'){
                console.log("成功");
                return hadDbError(err, req, res);
            }
        }
        if(result){
            res.redirect('/group_makeing');
            mongoose.disconnect();
        }
    });
});

//エラーハンドル
function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/group_makeing');
    mongoose.disconnect();
}

module.exports = router;
