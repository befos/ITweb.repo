var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var Users = new Schema({
  email: {type:String, required:true, index:true, unique:true},//Email(被りなし変更化)
  uid: {type:String, required:true, index:true, unique:true},//uid(被りなし)
  name: String,//ユーザーネーム（被りok!）(あとで変更可能)
  age: Number,//年齢
  sex: {type: Number, min:0, max:1},//0男性 1女性
  work: String,//職業
  uf_pl: String,//得意な言語//useful programing language
  place: String,//自分の住んでいる場所
  hashpass: String,//ハッシュ化されたパスワード
  salt: String,//お塩
  prop: String,//プロフィール用画像のURL予定
  url_pass: {type:String, required:true, index:true, unique:true},//認証用の一時url
  groupe: String,//所属しているグループ名
  regest: {type: Date, default: Date.now},//新規登録した時間の十分後
  regent: {type: Date, default: Date.now},//パスワードリセットを申請した時間の十分後
  ect: {type: Date, default: Date.now},//メールアドレス変更を申請した十分後
  ac_st: {type: Boolean, default:false},//accountstatus falseなら仮登録中
  ac_use: {type: Boolean, default:false},//現在accountが使用中か確認
  ac_reset: {type:Boolean, default:false},//現在accountのパスワードがリセット状態にあるか
  ac_ec: {type:Boolean, default:false},//現在accountのemailが変更されようとしているか
  ac_gr: {type:Boolean, default:false},//現在accountがグループに所属しているか
  cemail: String//変更時に一時的にEメールアドレスを保存
},{ collection:'user'});

var Forum = new Schema({
    foname: String,//フォーラムの名前（被りあり）
    host: String,//obj_idから主催者のデータを拾う
    count: Number,//アクセスされた回数
    uday: Date,//アップロードした日
    ques: String,//質問者が入力(質問内容)
    diff: Number,//難易度（0難しい、1普通、2簡単）
    tag: [String],//多分500要素まで？この中に言語も記述してもらう(ニコ動のタグみたいなもの)
    f_st: {type:Boolean, default:true},//forumの内容が解決済みか
    cont: [{type: Schema.Types.ObjectId, ref: 'ForumCont'},{_id:false}]
},{collection: 'forum'});

var ForumCont = new Schema({
    //forumcontの_idはforumのIDと同じになる
    _conid: {type: Schema.Types.ObjectId},//コンテンツID
    uid: String,
    name: String,//ユーザーが決めた自由な名前
    prop: String,//プロフィールの画像？
    cuday: {type:Date, default: Date.now},//コンテンツを上げた日
    chday: Date,//内容を編集した日
    text: String//回答者が入力(回答内容)
},{collection:'forumcont'});

//質問掲示板メモ　話題の質問　自分が出した質問

Users.plugin(uniqueValidator);
Forum.plugin(uniqueValidator);
ForumCont.plugin(uniqueValidator);

mongoose.connect('mongodb://localhost:27017/userdata');

mongoose.Promise = global.Promise;
exports.Users = mongoose.model("Users", Users);
exports.Forum = mongoose.model("Forum", Forum);
exports.ForumCont = mongoose.model("ForumCont", ForumCont);
