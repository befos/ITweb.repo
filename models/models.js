var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var Users = new Schema({
  email: {type:String, required:true, index:true, unique:true},//Email(被りなし変更化)
  uid: {type:String, required:true, index:true, unique:true},//uid(被りなし)
  name: String,//ユーザーネーム（被りok!）
  age: Number,//年齢
  sex: {type: Number, min:0, max:1},//0男性 1女性
  work: String,//職業
  uf_pl: String,//自分にとって使いやすい言語//useful programing language
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

var StudyM = new Schema({
    mname: String,//勉強会の名前
    host: String,//主催グループの名前（gidと紐付け)
    cate: String,//カテゴリー（ユーザーには指定させない）(あらかじめ用意したのを使わせる)
    uday: {type: Date, dafault: Date.now},//投稿日
    mday: Date, //勉強会開催日
    cont: String,//勉強会の募集内容
    m_st: {type:Boolean, default:true},//勉強会の募集状態(終わったらfalse)
    menber: [String]//uidで管理
},{ collection:'studymeeting'});

var MGroup = new Schema({
    todoc: {type:Number, index:true, unique:true},//都道府県コードを47都道府県分、初期値としていれる
    group: [{type: Schema.Types.ObjectId, ref:'Group'},{id:false}]//
},{collection:'mgroup'});

var Group = new Schema({
    todoc: {type: Number, ref:'MGroup'},//結合先から持ってきた都道府県コード
    gid: {type:String, required:true, index:true, unique:true},//グループにつけるユニークなID
    gname: String,//グループの名前
    host: String,//グループを作った人
    cate: String,//カテゴリー（ユーザーには指定させない）(あらかじめ用意したのを使わせる)(追加して欲しい場合は申請してもらう)
    place: String,//活動範囲？
    gmday: Date,//グループを作成した日
    menber: [String],//uidで管理
    g_st: {type:Boolean, default:true}//グループの状態//親グループがfalseになった場合子グループもすべてfalse
},{ collection:'group'});

var Forum = new Schema({
    foname: String,//フォーラムの名前（被りあり）
    host: String,//uid
    cate: String,//カテゴリ
    count: Number,//アクセスされた回数
    uday: Date,
    cont: [{//フォーラムの情報を格納する連想配列
        uid: String,
        name: String,
        prop: String,//プロフィールの画像？
        cuday: {type: Date, default: Date.now},//コンテンツを上げた日
        chday: Date,//内容を編集した日
        text: String//本文
    },{_id: false}],
    f_st: {type:Boolean, default:true}//forumの内容が解決済みか
},{collection: 'forum'});

//質問掲示板メモ　話題の質問　自分が出した質問

Users.plugin(uniqueValidator);
StudyM.plugin(uniqueValidator);
MGroup.plugin(uniqueValidator);
Group.plugin(uniqueValidator);
Forum.plugin(uniqueValidator);

mongoose.Promise = global.Promise;
exports.Users = mongoose.model("Users", Users);
exports.StudyM = mongoose.model("StudyM", StudyM);
exports.Mgroup = mongoose.model("MGroup", MGroup);
exports.Group = mongoose.model("Group", Group);
exports.Forum = mongoose.model("Forum", Forum);
