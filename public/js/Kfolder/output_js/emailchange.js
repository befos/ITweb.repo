function conrimMessage() {
  var id = document.getElementById("id").value;
  var uid = document.getElementById("uid").value;
 //必須チェック
 if(id == "" || uid =="") {
    alert("必須項目が入力されていません。");
    return false;
 }

  return true;
}
