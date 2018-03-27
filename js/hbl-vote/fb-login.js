
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



function loginFacebook(succuessLogin) {
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
          if (succuessLogin !== undefined){
            succuessLogin(data);
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