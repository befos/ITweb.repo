var routes = {
    success: require('./success'),
    home: require('./home'), //routesディレクト内のjsファイルを参照
    homepage: require('./homepage'),
    mypage: require('./mypage'),
    login: require('./login'),
    login_check: require('./login_check'),
    logout: require('./logout'),
    register: require('./register'),
    register_check: require('./register_check'),
    register_submit: require('./register_submit'),
    register_confirm: require('./register_confirm'),
    password_reset: require('./password_reset'),
    password_reset_mail: require('./password_reset_mail'),
    password_reset_regene: require('./password_reset_regene'),
    password_reset_submit: require('./password_reset_submit'),
    email_change: require('./email_change'),
    email_change_mail: require('./email_change_mail'),
    email_change_task: require('./email_change_task'),
    email_change_submit: require('./email_change_submit')
};

module.exports = routes;
