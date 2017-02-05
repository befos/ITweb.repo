var express = require('express');
var router = express.Router();
var url = require('url');
var qstring =require("querystring");
var async = require("async");
var template = require('../config/template.json');

/*ã?ã¼ã¿ãã?¼ã¹ã®æ¥ç¶è¨­å®?*/
var mongoose = require('mongoose');
var models = require('../models/models.js');ã
var Forum = models.Forum;
var User = models.Users;

router.get('/', function(req, res, next) {
    var u = url.parse(req.url, false);
    var query = qstring.parse(u.query);
    var error = req.session.error_status;
    //console.log(query.cate);
    //console.log(query.page);

    var data = {//DBããå¼ã£ãæã?ã¦ããæ?å ±ãé£æ³éå?ã?®éå?ã«æ ¼ç´?
        "dataurl": [],
        "datatitle": [],
        "datauser": [],
        "dataupday": [],
        "dataans": [],
        "datadiff": [],
        "datahostid": [],
        "status":"",
        "pbutton":[],
        "dataouturl":[],
        "tag":[]
    };

    var selectf;//ã?ã¼ã¿ãã?¼ã¹ããã?ã¼ã¿ãåãå?ºãããã?®å¤æ°
    var selectb;//ã?ã¼ã¿ãã?¼ã¹ããã?ã¼ã¿ãåãå?ºãããã?®å¤æ°

    if(query.page == 1){
        selectb = 0;
        selectf = 1 * 20 - 1;
    }else{
        selectf = query.page * 20 - 1;
        selectb = selectf - 20;
    }

    /*ã?ã¼ã¿ãã?¼ã¹æ¥ç¶?*/
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
        //console.log("connected");
    });
    Forum.find({f_st:true},{}, {sort:{uday: 1}}, function(err, result) {
        if (err) return hadDbError(err, req, res);
        if (result) {
            if (result.length === 0) { //åã_idãç¡ã?å ´åã?¯DBä¸ã«ã?ã¼ã¿ãè¦ã¤ãããªã?ã®ã§0
                //console.log("nosuch");
                return hadNotcontentsError(req, res);
            }else{
                    //console.log(result);
                for(i = selectb ; result.length > i && selectf > i ; i++){ã
                    var fourl = "/question_board_view?" + result[i]._id;//ãã©ã¼ã©ã?ã¢ã¯ã»ã¹ç¨ã®URLãä½æ??
                    var outurl = "/outlook_mypage?" + result[i].hostid;
                    data.dataurl.push(fourl);//ä½æ?ãããã®ãã?ãã·ã¥
                    data.dataouturl.push(outurl);
                    data.datatitle.push(result[i].foname);
                    data.dataupday.push(result[i].uday.toFormat("YYYY/MM/DD HH24:MI:SS"));
                    data.datahostid.push(result[i].hostid);
                    if(result[i].f_st === true){
                        data.dataans.push("/img/profile/æªè§£æ±º.png");
                    }else{
                        data.dataans.push("/img/profile/è§£æ±ºæ¸ã¿.png");
                    }
                    if(result[i].diff === 0){
                        data.datadiff.push("/img/profile/ç°¡å?.png");
                    }else if(result[i].diff === 1){
                        data.datadiff.push("/img/profile/æ®é?.png");
                    }else{
                        data.datadiff.push("/img/profile/é£ãã.png");
                    }
                    var itizi = [];
                    for(var h = 0 ; h < result[i].tag.length ; h++){
                        itizi.push(result[i].tag[h]);
                    }
                    data.tag[i] = itizi;
                }
                var list = [//ã¦ã¼ã¶ã¼IDã®ä¿å­é?å
                ];

                for(i = 0 ; i < data.datahostid.length ; i++){
                    list.push({id:data.datahostid[i]});
                }
                //console.log(list);
                async.eachSeries(list, function(data2, next) {//ã¦ã¼ã¶ã¼IDãã­ã¼ã«ãã¦åçã«Webãã?¼ã¸ã®æç¨¿è?åãå¤æ´ãã
                    setTimeout(function() {
                        User.find({_id:data2.id},{},function(err, result3){
                            if(err) return hadDbError(err, req, res);
                            data.datauser.push(result3[0].name);
                            next();
                        });
                    }, 0);
                }, function(err) {
                    /*ã?ã¼ã¿ãã?¼ã¹ã®å¦ç?çµäº?*/
                    /*--ãã?¼ã¸ãã?¼ã·ã§ã³ãä½¿ããããã«ããããã®è¨­å®?--*/ã
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
                    data.pbutton =[
                        "/qna_noans?",
                        "/qna_noans?",
                        "/qna_noans?",
                        "/qna_noans?",
                        "/qna_noans?"
                    ];
                    for(i = 0 ; i < 5 ; i++){
                        var itizi;
                        itizi = i+1;
                        data.pbutton[i] = data.pbutton[i] + "page=" + itizi;
                        //console.log(data.pbutton[i]);
                    }
                    data.status = "noans";
                    //console.log(data.status);
                    switch (query.page) {
                        case '1':
                            insclass.insclass1 = "active";
                            nextback.backurl = "/qna_noans?page=1";
                            nextback.nexturl = "/qna_noans?page=2";
                            nextback.backbutton = "disabled";
                            break;
                        case '2':
                            insclass.insclass2 = "active";
                            nextback.backurl = "/qna_noans?page=1";
                            nextback.nexturl = "/qna_noans?page=3";
                            break;
                        case '3':
                            insclass.insclass3 = "active";
                            nextback.backurl = "/qna_noans?page=2";
                            nextback.nexturl = "/qna_noans?page=4";
                            break;
                        case '4':
                            insclass.insclass4 = "active";
                            nextback.backurl = "/qna_noans?page=3";
                            nextback.nexturl = "/qna_noans?page=5";
                            break;
                        case '5':
                            insclass.insclass5 = "active";
                            nextback.backurl = "/qna_noans?page=4";
                            nextback.nexturl = "/qna_noans?page=5";
                            nextback.nextbutton = "disabled";
                            break;//ããã®ã¹ã¤ã?ãæã§ãªãã¸ã§ã¯ãã«å¤ãæ?¼ç´ããã?ã?¼ã¸ãã?¼ã·ã§ã³ã§ä½¿ããããã«ãã¦ã?ã?
                    default:
                        return hadUrlError(req ,res);
                    }
                    /*--ãã?¼ã¸ãã?¼ã·ã§ã³è¨­å®ã?¯ããã¾ã§--*/
                    /*ãã?®ä¸ããã?ã?¼ã¸ã®ã¬ã³ãã¼å¦ç?*/
                    req.session.error_status = 0;
                    if (req.session.user_id) {
                        res.locals = template.common.true; //varããããã¾ã§ã§ã?ã³ãã¬ã¼ãã«ä»£å¥ããå¤ãå?¥ãã¦ã?ã?
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
                });
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
