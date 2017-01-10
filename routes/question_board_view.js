var express = require('express');
var router = express.Router();
var url = require('url');

//検索結果画面
var mongoose = require('mongoose');
var models = require('../models/models.js');
var Forum = models.Forum;
var ForumCont = models.ForumCont;

var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
    console.log('connected');
    });
    var u = url.parse(req.url, false);
    var obj_id = u.query;
    console.log(obj_id);
    Forum.find({_id:obj_id}, function(err, result) {
        if(err) return hadDbError(err, req, res);
        if (result) {
            if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                return hadDbError(err, req, res);
            } else {
                //uidが見つかった
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
                        "Answer":[],
                        "Cuday":[],
                        "Cont":[]
                    };

                    for(var i = 0 ; i < result2.length ; i++){
                        data.Answer.push(result2[i].name);
                        data.Cuday.push(result2[i].cuday.toFormat("YYYY/MM/DD HH24:MI:SS"));
                        data.Cont.push(result2[i].text);
                    }
                    console.log(data);

                    req.session.error_status = 0;
                    if (req.session.user_id) {
                        res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
                        res.render('qna_disp', {
                            userName: req.session.user_id,
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
            }
        }
    });
});

function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}


module.exports = router;
