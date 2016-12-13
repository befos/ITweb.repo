$(function() {
    $('.glaybox').fadeIn(2000);
    /*ページトップへ戻る Jquery*/
    var pageTop = $(".toTop");
    pageTop.click(function() {
        $('body, html').animate({
            scrollTop: 0
        }, 300);
        return false;
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 200) {
            pageTop.fadeIn();
        } else {
            pageTop.fadeOut();
        }
    });
    // コンテンツのフェードイン
    $(window).scroll(function() {
        $('.fadein').each(function() {
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight + 200) {
                $(this).addClass('scrollin');
              }
        });
    });
    $(".mypage_main h1").on("click", function() {
            $(this).next().slideToggle();
    });
    $(window).resize(replaceText);
    replaceText();
    function replaceText(){
        var w = $(window).width();
        var x = 960;
        var tx = $('li.long_tx')
        if (w <= x) {
            tx.html("<a href='#'>JS</a>");
            tx.css({'color' : "white"})
        } else {
            tx.html("<a href='#'>JavaScript</a>");
            tx.css({'color' : 'white'})
        }
    }
    $('.category_btn').on('click',function(){
			$('.category_btn ul').slideToggle(600);
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
