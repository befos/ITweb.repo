var express = require('express');
var router = express.Router();
var url = require('url');
var template = require('../config/template.json');

router.get('/', function(req, res, next) {
    var u = url.parse(req.url, false);
    var error = req.session.error_status;
    var data = {//DBから引っこ抜いてきた情報を連想配列の配列に格納
        "dataurl": ["/question_board_view?hoge", "/question_board_view?hoge"],
        "datatitle": ["ほげ", "ほげほげ"],
        "datauser": ["Java", "Javascript"],
        "dataupday": ["2016/12/16", "2016/12/15"],
        "dataans": ["未解決", "解決済み"],
        "datadiff": ["簡単", "難しい"]
    };
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
    console.log(u.query);
    switch (u.query) {
        case null:
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
        return hadUrlError(req ,res);
    }
    /*--ページネーション設定はここまで--*/
    /*この下からページのレンダー処理*/
    req.session.error_status = 0;
    if (req.session.user_id) {
        res.locals = template.common.true; //varからここまででテンプレートに代入する値を入れている
        res.render('qna', {
            userName: req.session.user_id,
            error: error,
            reqCsrf: req.csrfToken(),
            data:data,
            data2:nextback,
            data3:insclass
        });
    } else {
        res.locals = template.common.false;
        res.render('qna', {
            error: error,
            reqCsrf: req.csrfToken(),
            data:data,
            data2:nextback,
            data3:insclass
        });
    }
});

router.post('/', function(req, res, next) {//ここで検索欄に入力された内容を解析して表示
    posttest = req.body.search;
    console.log(posttest);
});


//エラーハンドラ
function hadUrlError(req ,res){
    req.session.error_status = 5;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}


module.exports = router;
