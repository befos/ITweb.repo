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
  https://github.com/dscape/nano ←　参照
  hoge.create('fuga', function(err, body) {
    if (!err) {
    }
  });
  hoge.destroy('fuga'); fugaにドキュメント名を記入

  formからpostしてきた情報の取得
    var fuga = req.body.hoge; hogeはformで指定した名前

  セッション
  sessionstore + express-session

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
    もし実行中にエラーが出たら、
    $ curl -L https://npmjs.org/install.sh | sudo sh
    で再インストールできた。
