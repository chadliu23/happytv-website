(function($){

    $(function(){
        menu_load();
        footer_load();
        //popup();
    });

    function menu_load(){
        $.get("_header.html", function(result){
            $('.header').prepend(result);
            menu_open();
        });
        //$('.header').load('_header.html');
    };

    function menu_open(){
        $('.navbtn').on('click', function(e){
            e.preventDefault();
            if($('.navbtn').hasClass('open')){
                $('.navbtn').removeClass('open');
                $('.mask').stop().animate({ opacity: 0 });
                $('.menu').stop().animate({
                    opacity: 0
                },function(){
                    $('.menu').css({display:'none' }) ;
                    $('.mask').css({display:'none' }) ;
                });

            }else{
                $('.menu').css({display:'block'}) ;
                $('.mask').css({display:'block'}) ;
                $('.navbtn').addClass('open');
                $('.menu').stop().animate({opacity: 1});
                $('.mask').stop().animate({ opacity: 1 });
                menu_close();
            }
        });

    };

    function menu_close(){
        $('.header .menu li a, .mask').on('click', function(){
            $('.navbtn').removeClass('open');
            $('.mask').stop().animate({ opacity: 0 });
            $('.menu').stop().animate({
                opacity: 0
            },function(){
                $('.menu').css({display:'none' }) ;
                $('.mask').css({display:'none' }) ;
            });
        });
    };

    function footer_load () {
        $('.footer').load('_footer.html');
    };

    function popup(){
        $('.btn_popup').on('click', function(e){
            e.preventDefault();
            alert('如有報名上問題，無法自行解決，請加入官方Line @JDH4282L告知(客服人員將會於上班時間內盡速為您處理)');
        });
    }

})(jQuery);

$(document).ready(function(){
    $('.for-display').css("display", "none");
});


function openPopup() {
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
        $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
}

function closePopup(href) {
    $('#openModal').css({ 'opacity': '0', 'pointer-events': 'none' });
    setTimeout(function() {
        $('#openModal').css({ 'display': 'none' });
        if (href !== undefined){
            window.location.href=href;
        }

    }, 500);
};

$(document).on('click', '.not-open', function(e) {
    alert('尚未開放')
})

//$(document).ready(function(){
//
//    alert('hi')
//    menu_load();
//})
//
//
//function menu_load(){
//    $('.header').load('_menu.html');
//};