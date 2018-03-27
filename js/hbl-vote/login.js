


$(document).ready(function(){

  if (Cookies.get("member_token") !== undefined){
      $('#member-tag').css('display', 'inline-block');
        var avatar =  Cookies.get('member_image');
        $('#member-tag').html( 
        '<a class="" role="button" href="#">' +
          '<p><img height="18" src= '+avatar + ' /> '+ Cookies.get('member_nickname') + 
        '<span class="caret"></span></p></a>' );
        $('#login-tag').html( '<a class="logout" onclick="logout()" href="#"><p>' + '登出</p></a>');
        if ($('#username') !== undefined){
            $('#username').html(Cookies.get('member_nickname') + ' ( ID: ' + Cookies.get('member_id')+ ')');
        }
  }
});
