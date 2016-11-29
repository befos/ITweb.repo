var express = require('express');
var router = express.Router();

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var MGroup = models.MGroup;
var Group = models.Group;

router.post('/', function(req, res, next) {
    var gname = req.body.gname;
    var gid = req.body.gid;
    var place = req.body.place;
    var cate = req.body.cate; //フォームに入寮された情報を持ってくる
    var gmood = req.body.gmood;
    var gintro = req.body.gintro;
    req.session.error_status = 0;//errorステータスの初期化

    var onetimegroup = new Group({
        todoc:place,//結合先から持ってきた都道府県コード
        gid: gid,//グループにつけるユニークなID
        gname:gname,//グループの名前//被りなし
        host: req.session.user_id,//グループを作った人
        cate: cate,//カテゴリー（ユーザーには指定させない）(あらかじめ用意したのを使わせる)(追加して欲しい場合は申請してもらう)
        place: place,//活動範囲？
        gmood: gmood,//グループの雰囲気
        gmday: null,//グループを作成した日
        gintro: gintro,//グループ紹介文
        menber: [null],//uidで管理
        g_st: {type:Boolean, default:true}//グループの状態//親グループがfalseになった場合子グループも
    });

});

//errorハンドル
function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/group_makeing');
    mongoose.disconnect();
}

module.exports = router;
