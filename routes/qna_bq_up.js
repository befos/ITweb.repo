var express = require('express');
var router = express.Router();
var url = require('url');
var qstring =require("querystring");
var async = require("async");
var template = require('../config/template.json');

/*データベースの接続設定*/
var mongoose = require('mongoose');
var models = require('../models/models.js');　
var Forum = models.Forum;
var User = models.Users;

router.get('/', function(req, res, next) {
    if(!req.session.user_id){
        res.redirect('/login');
    }

    var u = url.parse(req.url, false);
    var query = qstring.parse(u.query);
    var error = req.session.error_status;

    /*データベース接続*/
    mongoose.connect('mongodb://localhost:27017/userdata', function(){
        //console.log("connected");
    });
    Forum.find({$and:[{bq:{$elemMatch:{$eq:query.myid}}},{_id:query.mfo}]},{}, {}, function(err, result) {
        if (err) return hadDbError(err, req, res);
        if (result) {
            if (result.length !== 0) { //同じ_idが無い場合はDB上にデータが見つからないので0
                //console.log("nosuch");
                return hadHighrateseqError(req, res);
            }else{
                    var insert = req.session.obj_id;
                    Forum.update({_id:query.mfo},{$push:{bq:insert}},function(err){
                        if(err) return hadDbError(req, res, err);
                        return hadHigirateSeq(req, res);
                    });
            }
        }
    });
});

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

function hadHighrateseqError(req, res){
    req.session.error_status = 19;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

function hadHigirateSeq(req, res){
    req.session.error_status = 18;
    res.redirect('/question_board_top');
    mongoose.disconnect();
}

module.exports = router;
