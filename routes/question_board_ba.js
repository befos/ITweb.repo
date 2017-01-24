var express = require('express');
var router = express.Router();
var url = require('url');
var async = require('async');

//検索結果画面
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Forum = models.Forum;
var ForumCont = models.ForumCont;
var User = models.Users;

var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
    console.log('connected');
    });
    var u = url.parse(req.url, false);
    var obj_id = u.query;
    console.log(obj_id);
    Forum.find({_id:obj_id}, function(err, result){
        if(err) return hadDbError(err, req, res);
        if (result) {
            if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                return hadDbError(err, req, res);
            } else {
                if(result[0].f_st === false){
                        return hadEndError(req, res);
                }
                console.log("such id");
                var forum1 ={
                    host:result[0].host,
                    title:result[0].foname,
                    uday:result[0].uday.toFormat("YYYY/MM/DD HH24:MI:SS"),
                    ques:result[0].ques
                };
                ForumCont.find({mfo:obj_id},{},{sort:{cuday: -1}},function(err, result2){
                    if(err) return hadDbError(err, req, res);

                    var data = {
                        "AnswerID":[],
                        "Answer":[],
                        "Cuday":[],
                        "Cont":[],
                        "_conid":[], //回答のID
                        "mfo":[]//質問のID
                    };

                    for(var i = 0 ; i < result2.length ; i++){
                        data.AnswerID.push(result2[i].answer);
                        data.Cuday.push(result2[i].cuday.toFormat("YYYY/MM/DD HH24:MI:SS"));
                        data.Cont.push(result2[i].text);
                        data._conid.push(result2[i]._conid);
                        data.mfo.push(result2[i].mfo);
                    }
                    console.log(data);
                    var list = [//ユーザーIDの保存領域
                    ];

                    for(i = 0 ; i < data.AnswerID.length ; i++){
                        list.push({id:data.AnswerID[i]});
                    }
                    console.log(list);
                    async.eachSeries(list, function(data2, next) {//ユーザーIDをキーにして動的にWebページの投稿者名を変更する
                        setTimeout(function() {
                            User.find({_id:data2.id},{},function(err, result3){
                                if(err) return hadDbError(err, req, res);
                                data.Answer.push(result3[0].name);
                                next();
                            });
                        }, 0);
                    }, function(err) {
                    req.session.error_status = 0;
                    if (req.session.user_id) {
                        res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
                        res.render('qna_disp_ba', {
                            userName: req.session.user_id,
                            reqCsrf: req.csrfToken(),
                            fo:forum1,
                            foid:obj_id,
                            data:data
                        });
                        mongoose.disconnect();
                    } else {
                        res.locals = template.common.false;
                        res.render('qna_disp_ba', {
                            reqCsrf: req.csrfToken(),
                            fo:forum1,
                            foid:obj_id,
                            data:data
                        });
                        mongoose.disconnect();
                    }
                });
                });
            }
        }
    });
});

router.post('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
        console.log('connected');
    });

    var baid = req.body.ba;//BAに選んだ回答のID
    var mfo = req.body.mfo;//質問のID
    var abaid = req.body.abaid;//回答者のID

    console.log(abaid);
    console.log(baid);
    console.log(mfo);

    Forum.update({_id:mfo},{$set:{baid:baid,abaid:abaid,f_st:false}},function(err){
        if(err) return hadDbError(err, req, res);
        req.session.error_status = 0;
        res.redirect('/question_board_view?' + mfo);
        mongoose.disconnect();
    });//DBを更新
});

function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

function hadEndError(req, res){
    req.session.error_status = 16;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}


module.exports = router;