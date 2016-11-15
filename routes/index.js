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
    register_submit: require('./register_submit'),
    register_confirm: require('./register_confirm'),
    logout: require('./logout'),
    mypage: require('./mypage')
};

module.exports = routes;
