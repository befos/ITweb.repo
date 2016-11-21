var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
  email: String,//Email(被りなし変更化)
  uid: String,//uid(被りなし)
  name: String,//ユーザーネーム（被りok!）
  age: Number,//年齢
  sex: {type: Number, min:0, max:1},//0男性 1女性
  work: String,//職業
  uf_pl: String,//自分にとって使いやすい言語//useful programing language
  place: String,//自分の住んでいる場所
  hashpass: String,//ハッシュ化されたパスワード
  salt: String,//お塩
  prop: String,//プロフィール用画像のURL予定
  url_pass: String,//認証用の一時url
  regest: { type: Date, default: Date.now},//新規登録した時間の十分後
  regent: {type: Date, default: Date.now},//パスワードリセットを申請した時間
  chpst: Date,//changepass time
  ac_st: {type: Boolean, default:false},//accountstatus falseなら1時間で消去
  ac_use: {type: Boolean, default:false},//現在accountが使用中か確認
  ac_reset: {type:Boolean, default:false},//現在accountのパスワードがリセット状態にあるか
  ac_ec: {type:Boolean, default:false}//現在accountのemailが変更されようとしているか
});

mongoose.Promise = global.Promise;
exports.Users = mongoose.model("Users", Users);
