

  var facebook_api_version = 'v2.9';

  window.fbAsyncInit = function() {
      FB.init({
        appId      : '1737378749850147',
        status     : true,
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
      });
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));



  function loginFacebook() {
    FB.login(function(response){
      if (response.authResponse){
        $.get('https://graph.facebook.com/'+facebook_api_version+'/me?access_token='+ response.authResponse.accessToken, function(data){
          if (data.name === undefined){
              console.log('access token expired @ testAPI : ' + data);
              // bootstrap_alert.warning('Facebook login fail.');
              return;
          }
          $.ajax({
            type: 'POST',
            headers: {
              "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp"
            },
            dataType: 'json',
            data: { "fb_id": data.id, "fb_token": response.authResponse.accessToken },
            url: 'https://api-product.happytv.com.tw/happytvmember/login?source=facebook&mode=homepage'
          }).done((data) => {
            succuessLogin(data);
          }).fail((data) =>{
            // bootstrap_alert.warning('This Facebook account as not register.');
            FB.logout(function(response) {
            });
          });
        });
      }else {
        // bootstrap_alert.warning('Facebook login fail.');
      }
    });
}

function logout() {
    if (Cookies.get("member_token") !== undefined){
      Cookies.remove('member_token');
    }
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        FB.logout(function(response) {
        });
      }
    });

    window.location.reload();
}


function succuessLogin(data){
  $('#member-tag').css('display', 'block');
  var avatar =  data.result.member_image;
  $('#member-tag').html( 
    '<a class="dropdown-toggle" data-toggle="dropdown" role="button" href="#">' +
      '<img height="18" src= '+avatar + ' /> '+ data.result.member_nickname + 
    '<span class="caret"></span></a>' +
    '<ul class="dropdown-menu collapse">' +
    '<li><a href="#">戰隊資訊</a></li>'+
    '</ul>');
  $('#login-tag').html( '<a onclick="logout()">' + '登出</a>');
  if ($('#username') !== undefined){
      $('#username').html(data.result.member_nickname);
  }
  Cookies.set("member_id", data.result.member_id,
     { expires: 1 });
  Cookies.set("member_token", data.result.member_token,
     { expires: 1 });
  Cookies.set("member_nickname", data.result.member_nickname,
     { expires: 1 });
  Cookies.set("member_image", data.result.member_image,
     { expires: 1 });
  window.location.reload();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function(){
  $('#edit-button').on('click', (event) => {
    $('.for-display').css('display', 'none');
    $('.for-input').css('display', 'inline');
  })

  if (Cookies.get("member_token") !== undefined){

      $('#member-tag').css('display', 'block');
      var avatar =  Cookies.get('member_image');
      $('#member-tag').html( 
      '<a class="dropdown-toggle " data-toggle="dropdown" role="button" href="#">' +
        '<p><img height="18" src= '+avatar + ' /> '+ Cookies.get('member_nickname') + 
      '<span class="caret"></span></p></a>' +
      '<ul class="dropdown-menu collapse">' +
      '<li><a href="#">戰隊資訊</a></li>'+
      '</ul>');
      $('#login-tag').html( '<a class="dropdown-toggle logout" onclick="logout()" href="#"><p>' + '登出</p></a>');
      if ($('#username') !== undefined){
          $('#username').html(Cookies.get('member_nickname') + ' ( ID: ' + Cookies.get('member_id')+ ')');
      }
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://api-product.happytv.com.tw/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
      }).done((data) => {

        if (data.result.length >0){
          $('#team-name-label').val(data.result[0].team_name);
          $('#team-name-input').val(data.result[0].team_name);
          $('#team_id').val(data.result[0].team_id);
        }
        for (var i = data.result.length - 1; i >= 0; i--) {
          let member = data.result[i];
          $('#row_id_' + member.member_role).val(member.row_id);
          $('#summoner_label_' + member.member_role).val(member.summoner);
          $('#summoner_input_' + member.member_role).val(member.summoner);
          $('#member_name_label_' + member.member_role).val(member.member_name);
          $('#member_name_input_' + member.member_role).val(member.member_name);
          $('#school_name_label_' + member.member_role).val(member.school_name);
          $('#school_name_input_' + member.member_role).val(member.school_name);
          $('#student_id_label_' + member.member_role).val(member.student_id);
          $('#student_id_input_' + member.member_role).val(member.student_id);
          $('#phone_label_' + member.member_role).val(member.phone);
          $('#phone_input_' + member.member_role).val(member.phone);
          $('#email_label_' + member.member_role).val(member.email);
          $('#email_input_' + member.member_role).val(member.email);
          if (member.member_id !== null){
            $('#email_verify_success_' + member.member_role).css('display', '');
          }else{
            $('#email_unverify_' + member.member_role).css('display', '');
            $('#email_verify_again_' + member.member_role).css('display', '');
          }
          if(member.id_front_photo !== ''){
            $('#id_front_photo_label_'+ member.member_role).attr('src', member.id_front_photo);
          }  
        }
        let message = getParameterByName('message');
    
        if (message !==undefined && message !== null){
          alert(message);
        }
      }).fail((data) =>{
        window.location.replace('register-interface-before.html'); 
      });


      
  }else{
    $('#openModal').css({ 'display': 'block' });
        setTimeout(function() {
            $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }, 500);
  }
});
