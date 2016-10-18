var routes = {
  home: require('./home'),
  users: require('./users'), //routesディレクト内のjsファイルを参照
  hoge: require('./hoge')
};

module.exports = routes;
