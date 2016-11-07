var routes = {
    success: require('./success'),
    home: require('./home'),
    users: require('./users'), //routesディレクト内のjsファイルを参照
    hoge: require('./hoge'),
    homepage: require('./homepage'),
    login: require('./login'),
    login_check: require('./login_check'),
    register: require('./register'),
    register_check: require('./register_check'),
    logout: require('./logout')
};

module.exports = routes;
