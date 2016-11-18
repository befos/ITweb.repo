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

/*バリデーション validation engine*/
//
// (function($) {
//   $(jQueryObject).validationEngine({
//     promptPosition: "topLeft",
//     showArrowOnRadioAndCheckbox: true,
//     focusFirstField: false,
//     scroll: false
//   });
// })(jQuery);
//
// // ログインボタンの処理
// $(document).ready(function(){
//   $(function() {
//       $('#Loginbtn li img').hover(
//           function(){
//               $(this).stop().animate({'marginTop':'-29px'},'fast');
//           },
//           function () {
//               $(this).stop().animate({'marginTop':'0px'},'fast');
//           }
//       );
//   });
// });
