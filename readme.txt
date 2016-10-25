ITweb.repoのファイル構造についての説明
  bin //サーバー起動時のリッスンポートなどについて記述したファイルを入れるディレクトリ
  node_modules //触らないで。
  public //静的コンテンツを配置するディレクトリ(.html,.css,.js)(htmlファイルはpublic直下に置く)
  routes //ルーティングに関するファイルを配置
  views //jadeファイルを配置 ※jadeファイルとはテンプレートエンジンである(中身はhtmlとほぼ同じ)
  app.js //サーバーの根幹,設定やエラーハンドラなどが書かれている。 編集には十分注意
  package.json //パッケージのバージョンが記述してあるJsonファイル(絶対消さないで)

webページを追加する
  1.routesディレクトリ内に追加したいページ名と同じ名前の.jsファイルを追加(中身は前のコードを参考に)
  2.routes/index.js内の配列にカレントディレクトリに先ほど置いた.jsファイルを記述
  3.app.jsファイルのapp.use(/hoge, routes.hoge);を記述
  4.localhost/hoge　でアクセス可能！やったぜ

dbに接続する方法
  var DB_PORT = "5984";
  var DB_ADDRESS = "http://localhost:";
  var nano = require('nano')(DB_ADDRESS + DB_PORT);
  var hoge = nano.db.use('hoge');//スコープの設定(この状態だとhogeにスコープがある)
     hogeはDB名を記述
制御方法
  Example
  var userdata = nano.db.use('userdata');
  userdata.get(id,function(err, jsonobj) { //フォームに入力されたIDと同名のドキュメントをコレクションuserdataから探してくる
   if(err){
     console.log("nosuch");//見つからなかった場合の処理
   }
   if (!err) { //見つかった場合
     console.log("suchdoc");
     var dbpass =  jsonobj.hashpass;//jsonオブジェクトからhashpassを参照し変数に格納
     var salt = jsonobj.salt;//DB内参照

  セッション
  ~connect-couchdb + express-session~
  var connect = require('connect');
  var ConnectCouchDB = require('connect-couchdb')(session);
  var store = new ConnectCouchDB({ //セッション管理用DB接続設定
    name: 'sessiondata',
    username: '',
    password: '',
    host: 'localhost',
  });
  app.use(session({         // cookieに書き込むsessionの仕様を定める
    secret: 'ajax-hohoho',               // 符号化。改ざんを防ぐ
    store: sessionstore.createSessionStore({
        type: 'couchdb',
        host: 'http://localhost',  // optional
        port: 5984,                // optional
        dbName: 'express-sessions',// optional
        collectionName: 'sessions',// optional
        timeout: 10000             // optional
    }),
    cookie: { //cookieのデフォルト内容
      httpOnly: false,
      maxAge: 60 * 60 * 1000
    }
  }));

nodeやnpmのエラー対処
  本当に困ったらこれ↓
  【その1】 Node.jsの再インストール
    $ node -v
    $ sudo npm cache clean -f
    $ sudo npm install -g n
    $ sudo n stable
    $ node -v
    で、再インストール。
  【その2】 npmの再インストール
    $ npm install -g npm
