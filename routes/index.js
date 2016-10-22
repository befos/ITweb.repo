var routes = {
  home: require('./home'),
  users: require('./users'), //routesディレクト内のjsファイルを参照
  hoge: require('./hoge'),
  login: require('./login'),
  logincheck: require('./logincheck')
};

module.exports = routes;
