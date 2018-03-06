
$(document).ready(function(){

  if (Cookies.get("member_token") !== undefined){
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://api-product.happytv.com.tw/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
      }).done((data) => {
       window.location.replace('register-interface-after.html');
      }).fail((data) =>{
         
      });
  }else{
    $('#openModal').css({ 'display': 'block' });
        setTimeout(function() {
            $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }, 500);
  }
});
