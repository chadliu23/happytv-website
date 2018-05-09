  var facebook_api_version = 'v2.12';

  window.fbAsyncInit = function() {
      FB.init({
        //appId      : '1737378749850147',
        appId      : '186797928612077',
        status     : true,
        cookie     : true,  // enable cookies to allow the server to access
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.12' // use graph api version 2.8
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
    //return console.log('sddsdsdsd')
    FB.login(function(response){
      if (response.authResponse){
        $.get('https://graph.facebook.com/'+facebook_api_version+'/me?access_token='+ response.authResponse.accessToken, function(data){
          console.log('登入data',data)
          console.log('登入token', response.authResponse.accessToken)
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
            url: 'http://localhost/happytvmember/login?source=facebook&mode=homepage'
          }).done((data) => {
            console.log('登入成功的data:', data)
            succuessLogin(data);
          }).fail((data) =>{
            console.log('失敗data', data)
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
  console.log('logout')
    if (Cookies.get("member_token") !== undefined){
      Cookies.remove('member_token');
    }
    FB.getLoginStatus(function(response) {
      console.log('取得fb狀態', response)
      if (response.status == 'connected') {
        console.log('準備登出')
        FB.logout(function(response) {
          window.location.reload();
        });
      }
    });
}


function succuessLogin(data){
  console.log('已經呼叫登入成功的data', data)
   $('#member-tag').css('display', 'block');
  var avatar =  data.result.member_image;
  // $('#member-tag').html(
  //   '<a class="dropdown-toggle" data-toggle="dropdown" role="button" href="#">' +
  //     '<img height="18" src= '+avatar + ' /> '+ data.result.member_nickname +
  //   '<span class="caret"></span></a>' +
  //   '<ul class="dropdown-menu collapse">' +
  //   '<li><a href="#">戰隊資訊</a></li>'+
  //   '</ul>');
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
  console.log('Cookies.get("member_token"):', Cookies.get("member_token"))
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
        $('#login-tag').html( '<a onclick="logout()" href="#">' + '登出</a>');
        //$('#login-tag').html( '<a class="dropdown-toggle logout" onclick="logout()" href="#"><p>' + '登出</p></a>');
        if ($('#username') !== undefined){
            $('#username').html(Cookies.get('member_nickname') + ' ( ID: ' + Cookies.get('member_id')+ ')');
        }
  }
});
