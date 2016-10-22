var express = require('express');
var router = express.Router();

//データベース接続および設定
var DB_PORT = "5984";
var DB_ADDRESS = "http://localhost:";
var nano = require('nano')(DB_ADDRESS + DB_PORT);
var userdata = nano.db.use('userdata');//スコープの設定(この状態だとuserdataにスコープがある)


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  userdata.get('examplesan@st.kobedenshi.ac.jp',
    function(err, body) {
      if (!err) {
        res.send(body);
      }
    });
});

module.exports = router;
