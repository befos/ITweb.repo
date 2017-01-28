var express = require('express');
var router = express.Router();
var url = require('url');
var async = require("async");

//検索結果画面
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Forum = models.Forum;
var ForumCont = models.ForumCont;
var User = models.Users;

var template = require('../config/template.json');

router.get('/', function(req, res, next) {

    //データベース接続設定
    var db = mongoose.connection;
    db.on('open', function() {
    });
    db.on('close', function() {
    });
    db.open("mongodb://localhost:27017/userdata");

    var u = url.parse(req.url, false);
    var obj_id = u.query;
    //console.log(obj_id);
    Forum.find({_id:obj_id}, function(err, result){
        if(err) return hadDbError(err, req, res);
        if (result) {
            if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                return hadDbError(err, req, res);
            } else {
                //uidが見つかった
                //console.log("such id");
                var forum1 ={
                    hostid:result[0].hostid,
                    host:"",
                    title:result[0].foname,
                    uday:result[0].uday.toFormat("YYYY/MM/DD HH24:MI:SS"),
                    ques:result[0].ques,
                    balink:"question_board_ba?" + obj_id
                };
                req.session.onetimefoid = result[0].id;
                User.find({_id:forum1.hostid},{},function(err, result3){
                    if(err) return hadDbError(err, req, res);
                    if(result3.length === 0){
                        forum1.host ="このユーザは存在しません。";
                    }else{
                    forum1.host = result3[0].name;
                    }
                    ForumCont.find({mfo:obj_id},{},{sort:{cuday: -1}},function(err, result2){
                        if(err) return hadDbError(err, req, res);
                        var data = {
                            "AnswerID":[],
                            "Answer":[],
                            "Cuday":[],
                            "Cont":[],
                        };
                        for(var i = 0 ; i < result2.length ; i++){
                            data.AnswerID.push(result2[i].answer);
                            data.Cuday.push(result2[i].cuday.toFormat("YYYY/MM/DD HH24:MI:SS"));
                            data.Cont.push(result2[i].text);
                        }
                        //console.log(data);
                        var list = [//ユーザーIDの保存領域
                        ];

                        for(i = 0 ; i < data.AnswerID.length ; i++){
                            list.push({id:data.AnswerID[i]});
                        }
                        //console.log(list);
                        async.eachSeries(list, function(data2, next) {//ユーザーIDをキーにして動的にWebページの投稿者名を変更する
                            setTimeout(function() {
                                User.find({_id:data2.id},{},function(err, result3){
                                    if(err) return hadDbError(err, req, res);
                                    if(result3.length === 0){
                                        data.Answer.push("このユーザは存在しません。");
                                        return next();
                                    }
                                    data.Answer.push(result3[0].name);
                                    next();
                                });
                            }, 0);
                        }, function(err) {
                        req.session.error_status = 0;
                        if (req.session.user_id) {
                            res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
                            res.render('qna_disp', {
                                userName: req.session.user_name,
                                reqCsrf: req.csrfToken(),
                                fo:forum1,
                                foid:obj_id,
                                data:data
                            });
                            mongoose.disconnect();
                        } else {
                            res.locals = template.common.false;
                            res.render('qna_disp', {
                                reqCsrf: req.csrfToken(),
                                fo:forum1,
                                foid:obj_id,
                                data:data
                            });
                            mongoose.disconnect();
                        }
                    });
                });
            });
            }
        }
    });
});

function hadDbError(err, req, res){
    //console.log(err);
    req.session.error_status = 6;
    res.redirect(400, '/question_board_top');
    mongoose.disconnect();
}


module.exports = router;
