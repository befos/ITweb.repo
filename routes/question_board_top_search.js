var express = require('express');
var router = express.Router();
var replaceall = require("replaceall");
var url = require('url');
var qstring =require("querystring");
var template = require('../config/template.json');

/*データベースの接続設定*/
var mongoose = require('mongoose');
var models = require('../models/models.js');　
var Forum = models.Forum;
var User = models.Users;

router.get('/', function(req, res, next) {
    var u = url.parse(req.url, false);
    var query = qstring.parse(u.query);
    var error = req.session.error_status;
    var searchbox = [];
    //console.log(query.search);
    //console.log(query.page);

    var data = {//DBから引っこ抜いてきた情報を連想配列の配列に格納
        "dataurl": [],
        "datatitle": [],
        "datauser": [],
        "dataupday": [],
        "dataans": [],
        "datadiff": [],
        "dataouturl":[],
        "tag":[]
    };

    var selectf;//データベースからデータを取り出すための変数
    var selectb;//データベースからデータを取り出すための変数


    if(query.page === undefined){
        selectb = 0;
        selectf = 1 * 20 - 1;
    }else{
        selectf = query.page * 20 - 1;
        selectb = selectf - 20;
    }

    /*データベース接続*/
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
        //console.log("connected");
    });

    searchbox = replaceall("　"," ",query.search).split(" ");//スペースで文字列を判別して,分けて配列に入れる
    //console.log(searchbox);

    for(var g = 0; searchbox.length > g ; g++){
        searchbox[g] = new RegExp(searchbox[g]);//正規表現オブジェクト/hoge/の作成（キモ）
    }

    //console.log(searchbox);

    Forum.find({$or : [{foname:{$in:searchbox}},{ques:{$in:searchbox}},{tag:{$elemMatch:{$in:searchbox}}},{host:{$in:searchbox}}]},{hostid:0}, {sort:{uday: -1}}, function(err, result){//正規表現を用いて検索文字が入っているドキュメントを探す
        if (err) return hadDbError(err, req, res);
        //console.log(result);
        if (result) {
            if (result.length === 0) { //同じ_idが無い場合はDB上にデータが見つからないので0
                //console.log("nosuch");
                return hadNotcontentsError(req, res);
            }else{
                for(i = selectb ; result.length > i && selectf > i ; i++){　
                    var fourl = "/question_board_view?" + result[i]._id;//フォーラムアクセス用のURLを作成
                    var outurl = "/outlook_mypage?" + result[i].hostid;
                    data.dataurl.push(fourl);//作成したものをプッシュ
                    data.dataouturl.push(outurl);
                    data.datatitle.push(result[i].foname);
                    data.datauser.push(result[i].host);
                    data.dataupday.push(result[i].uday.toFormat("YYYY/MM/DD HH24:MI:SS"));
                    if(result[i].f_st === true){
                        data.dataans.push("/img/profile/未解決.png");
                    }else{
                        data.dataans.push("/img/profile/解決済み.png");
                    }
                    if(result[i].diff === 0){
                        data.datadiff.push("/img/profile/簡単.png");
                    }else if(result[i].diff === 1){
                        data.datadiff.push("/img/profile/普通.png");
                    }else{
                        data.datadiff.push("/img/profile/難しい.png");
                    }
                    var itizi = [];
                    for(var h = 0 ; h < result[i].tag.length ; h++){
                        itizi.push(result[i].tag[h]);
                    }
                    data.tag[i] = itizi;
                }
                /*データベースの処理終了*/
                /*--ページネーションを使えるようにするための設定--*/　
                var nextback ={
                    "backurl":"/question_board_top",
                    "nexturl":"/question_board_top",
                    "nextbutton":"",
                    "badkbutton":""
                };
                var insclass ={
                    "insclass1":"dummy",
                    "insclass2":"dummy",
                    "insclass3":"dummy",
                    "insclass4":"dummy",
                    "insclass5":"dummy"
                };
                switch (query.page) {
                    case undefined:
                        insclass.insclass1 = "active";
                        nextback.backurl = "/question_board_top";
                        nextback.nexturl = "/question_board_top?2";
                        nextback.backbutton = "disabled";
                        break;
                    case '2':
                        insclass.insclass2 = "active";
                        nextback.backurl = "/question_board_top";
                        nextback.nexturl = "/question_board_top?3";
                        break;
                    case '3':
                        insclass.insclass3 = "active";
                        nextback.backurl = "/question_board_top?2";
                        nextback.nexturl = "/question_board_top?4";
                        break;
                    case '4':
                        insclass.insclass4 = "active";
                        nextback.backurl = "/question_board_top?3";
                        nextback.nexturl = "/question_board_top?5";
                        break;
                    case '5':
                        insclass.insclass5 = "active";
                        nextback.backurl = "/question_board_top?4";
                        nextback.nexturl = "/question_board_top?5";
                        nextback.nextbutton = "disabled";
                        break;//ここのスイッチ文でオブジェクトに値を格納し、ページネーションで使えるようにしている
                default:
                    //console.log("throw switch");
                    return hadUrlError(req ,res);
                }
                /*--ページネーション設定はここまで--*/
                /*この下からページのレンダー処理*/
                req.session.error_status = 0;
                if (req.session.user_id) {
                    res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
                    res.render('qna', {
                        userName: req.session.user_name,
                        error: error,
                        reqCsrf: req.csrfToken(),
                        data:data,
                        data2:nextback,
                        data3:insclass
                    });
                    mongoose.disconnect();
                } else {
                    res.locals = template.common.false;
                    res.render('qna', {
                        error: error,
                        reqCsrf: req.csrfToken(),
                        data:data,
                        data2:nextback,
                        data3:insclass
                    });
                    mongoose.disconnect();
                }
            }
        }
    });
});

function hadNotcontentsError(req, res){
    req.session.error_status = 15;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

function hadUrlError(req ,res){
    req.session.error_status = 5;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

function hadDbError(err, req, res) {
    //console.log(err);
    req.session.error_status = 6;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

module.exports = router;
