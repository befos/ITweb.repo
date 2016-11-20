var express = require('express');
var router = express.Router();
var url = require('url');
require('date-utils');

//データベース接続および設定
var mongoose = require('mongoose');
var models = require('../models/models.js');
var User = models.Users;

router.get('/', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/userdata');
    var u = url.parse(req.url, false);
    var dt = new Date();
    var confirmtime = dt.toFormat("YYYY/MM/DD HH24:MI:SS");
    console.log(u.query);
    var one_shot_query = u.query;
    User.find({url_pass:one_shot_query}, function(err, result) {
            if (result) {
                if (result.length === 0) {//同じ_idが無い場合はDB上にデータが見つからないので0
                    console.log("nosuch"); //見つからなかった場合の処理(時間外)
                    req.session.error_status = 5;
                    res.redirect('/register');
                    mongoose.disconnect();
                } else {
                    //見つかった
                    var email = result[0]._id;
                    var status = result[0].ac_st;
                    if(status === true){
                      req.session.error_status = 3;
                      console.log('this account Activeted');
                      res.redirect('/login');
                      mongoose.disconnect();
                    }
                    User.update({_id: email},{$set: {ac_use:true}},function(err){
                      if(!err){
                        User.update({_id: email},{$set: {ac_st:true}},function(err){
                          if(!err){
                            console.log("Acitvete account");
                            req.session.error_status = 0;
                            res.render('register_confirm');
                            mongoose.disconnect();
                          }
                        });
                      }
                    });
                }
            }
            mongoose.disconnect();
    });
});

module.exports = router;
