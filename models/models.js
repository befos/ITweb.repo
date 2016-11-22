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
  regent: {type: Date, default: Date.now},//パスワードリセットを申請した時間の十分後
  ect: {type: Date, default: Date.now},//メールアドレス変更を申請した十分後
  ac_st: {type: Boolean, default:false},//accountstatus falseなら仮登録中
  ac_use: {type: Boolean, default:false},//現在accountが使用中か確認
  ac_reset: {type:Boolean, default:false},//現在accountのパスワードがリセット状態にあるか
  ac_ec: {type:Boolean, default:false},//現在accountのemailが変更されようとしているか
  cemail: String//変更時に一時的にEメールアドレスを保存
},{ collection: 'user'});

var StudyM = new schema({
    mname: String,//勉強会の名前
    host: String,//主催者の名前(uidと紐付け)
    place: String,//場所
    cate: String,//カテゴリ
    uday: {type: Date, dafault: Date.now},//投稿日
    mday: Date, //勉強会開催日
    cont: String,//勉強会の募集内容
    m_st: {type:Boolean, default:true},//勉強会の募集状態(終わったらfalse)
    menber: [String]
},{ collection: 'studymeeting'});

mongoose.Promise = global.Promise;
exports.Users = mongoose.model("Users", Users);
