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
            alert("入力された情報が間違っています。");
            break;
        case '2':
            alert("入力されたIDまたはアドレスは登録済みです。");
            break;
        case '3':
            alert("このアカウントは承認済みです。");
            break;
        case '4':
            alert("メールの送信に失敗しました。");
            break;
        case '5':
            alert("不正なアクセスです。");
            break;
        case '6':
            alert("DBのエラーです。");
            break;
        case '7':
            alert("パスワードリセットが要求済みです。");
            break;
        case '8':
            alert("セッションエラーです。");
            break;
        case '9':
            alert("アカウントが仮登録の状態です。");
            break;
        case '10':
            alert("ログインされていません。");
            break;
        case '11':
            alert("既にログアウトされています。");
            break;
        case '12':
            alert("お問い合わせ頂きありがとうございます。");
            break;
        case '13':
            alert("異常なアクセスが検知されたので一時的にアクセスを制限します。");
            break;
        case '14':
            alert("投稿処理が完了いたしました。");
            break;
        case '15':
            alert("投稿された質問が存在しません。");
            break;
        case '16':
            alert("質問は解決済みです。");
            break;
    }
}
window.onload = setError;
