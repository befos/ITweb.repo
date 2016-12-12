var express = require('express');
var router = express.Router();

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

router.get('/', function(req, res, next){
    mongoose.connect('mongodb://localhost:27017/userdata');
    if(req.session.user_id){//セッションにidが存在するか確認
        var obj_id = req.session.obj_id;
        User.find({_id:obj_id}, function(err, result) {
            if(err) return hadDbError(err, req, res);
            if (result) {
                if (result.length === 0) {//同じuidが無い場合はDB上にデータが見つからないので0
                    return hadDbError(err, req, res);
                } else {
                    //uidが見つかった
                    console.log("such uid");
                    var user_name = result[0].name;
                    var user_id = result[0].uid;
                    var user_age = result[0].age;
                    var user_work = result[0].work;
                    var user_sex;
                    if(result[0].sex === 0){
                        user_sex = '男';
                    }else if(result[0].sex == 1){
                        user_sex = '女';
                    }else{
                        user_sex ='';
                    }
                    var insert = {
                        userName:req.session.user_id,
                        user_name:user_name,
                        user_id:user_id,
                        user_age:user_age,
                        user_work:user_work,
                        user_sex:user_sex
                    };
                    req.session.error_status = 0;
                    res.locals = insert;//テンプレートに読み込む
                    res.render('mypage');
                    mongoose.disconnect();
                }
            }
        });
    }else{
        return hadNologinError(req, res);
    }
});

//エラーハンドラ
function hadDbError(err, req, res){
    console.log(err);
    req.session.error_status = 6;
    res.redirect('/');
    mongoose.disconnect();
}

function hadNologinError(req, res){
    //req.session.error_status = 10;
    res.redirect('/login');
    mongoose.disconnect();
}

module.exports = router;
