var passwordLevel = 0;

function setMessage(password) {
    passwordLevel = getPasswordLevel(password);
    var message = "";
    if (passwordLevel == 1) {
        message = "弱い";
    }
    if (passwordLevel == 2) {
        message = "やや弱い";
    }
    if (passwordLevel == 3) {
        message = "普通";
    }
    if (passwordLevel == 4) {
        message = "やや強い";
    }
    if (passwordLevel == 5) {
        message = "強い";
    }

    var div = document.getElementById("pass_message");
    if (!div.hasFistChild) {
        div.appendChild(document.createTextNode(""));
    }
    div.firstChild.data = message;
}

/*
 * パスワード一致チェック
 */
function setConfirmMessage(confirm_password) {
    var password = document.getElementById("password").value;
    var message = "";
    if (password == confirm_password) {
        message = "";
    } else {
        message = "パスワードが一致しません";
    }

    var div = document.getElementById("pass_confirm_message");
    if (!div.hasFistChild) {
        div.appendChild(document.createTextNode(""));
    }
    div.firstChild.data = message;
}

/*
 * Email一致チェック
 */
function setConfirmMessage1(confirm_Email) {
    var Email = document.getElementById("Email").value;
    var message = "";
    if (Email == confirm_Email) {
        message = "";
    } else {
        message = "メールアドレスが一致しません";
    }
    var div = document.getElementById("Email_confirm_message");
    if (!div.hasFistChild) {
        div.appendChild(document.createTextNode(""));
    }
    div.firstChild.data = message;
}

function setError() { //リダイレクトされて戻ってきた時のエラー文表示
    var Error_status = document.getElementById("Error_status").value;
    switch (Error_status) {
        case '0':
            break;
        case '1':
            alert("code:1 入力された情報が間違っています。");
            break;
        case '2':
            alert("code:2 入力されたIDまたはアドレスは登録済みです。");
            break;
        case '3':
            alert("code:3 このアカウントは承認済みです。");
            break;
        case '4':
            alert("code:4 メールの送信に失敗しました。");
            break;
        case '5':
            alert("code:5 不正なアクセスです。");
            break;
        case '6':
            alert("code:6 DBのエラーです。");
            break;
        case '7':
            alert("code:7 パスワードリセットが要求済みです。");
            break;
        case '8':
            alert("code:8 セッションエラーです。");
            break;
        case '9':
            alert("code:9 アカウントが仮登録の状態です。");
            break;
        case '10':
            alert("code:10 ログインされていません。");
            break;
        case '11':
            alert("code:11 既にログアウトされています。");
            break;
        case '12':
            alert("code:12 貴重なご意見を頂きありがとうございます。頂いた意見は今後のサイトの改善の参考にさせていただきます。");
            break;
    }
}
window.onload = setError;
