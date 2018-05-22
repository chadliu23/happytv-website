(function($){

    $(function(){
        //menu_load();
        popup();
    });

    // function menu_load(){
    //     $('.header').load('_header.html');
    // };

    function popup(){
        $('.btn_popup').on('click', function(e){
            e.preventDefault();
            alert('如有報名上問題，無法自行解決，請隊長加入官方賴群告知（於上班時間內會即時處理）');
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

function closePopup() {
    $('#openModal').css({ 'opacity': '0', 'pointer-events': 'none' });
    setTimeout(function() {
        $('#openModal').css({ 'display': 'none' });
    }, 500);
};


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