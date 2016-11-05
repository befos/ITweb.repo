/*ページトップへ戻る Jquery*/
$(function(){
  var pageTop = $(".toTop");
  pageTop.click(function () {
    $('body, html').animate({ scrollTop: 0 }, 300);
    return false;
  });
  $(window).scroll(function () {
    if($(this).scrollTop() >= 200) {
      pageTop.fadeIn();
    } else {
      pageTop.fadeOut();
    }
  });
});
