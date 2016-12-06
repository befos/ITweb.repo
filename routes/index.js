var routes = {
    success: require('./success'),
    home: require('./home'), //routesディレクト内のjsファイルを参照
    toppage: require('./toppage'),
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
    email_change_submit: require('./email_change_submit'),
    question_board_top: require('./question_board_top'),
    question_board_contents: require('./question_board_contents'),
    question_board_confirem: require('./question_board_confirm'),
    question_board_submit: require('./question_board_submit'),
    question_board_view: require('./question_board_view')
};

module.exports = routes;
