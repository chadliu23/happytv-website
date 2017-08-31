


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
              bootstrap_alert.warning('Facebook login fail.');
              return;
          }
          $.ajax({
            type: 'POST',
            headers: {
              "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
            },
            dataType: 'json',
            data: { "fb_id": data.id, "fb_token": response.authResponse.accessToken },
            url: 'https://api.happytv.com.tw/happytvmember/login?source=facebook'
          }).done((data) => {
            succuessLogin(data);
          }).fail((data) =>{
            bootstrap_alert.warning('This Facebook account as not register.');
            FB.logout(function(response) {
            });
          });
        });
      }else {
        bootstrap_alert.warning('Facebook login fail.');
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

    window.location.replace("/index.html");
}

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
  $('#alert_placeholder').html('<div id="alertEmail" class="alert alert-danger fade"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
  $("#alertEmail").addClass("in");
  $("#alertEmail").fadeTo(2000, 500).slideUp(500, function(){
      $("#alertEmail").slideUp(500);
  });
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function succuessLogin(data){
   $('#member-tag').css('display', 'block');
  var avatar =  data.result.member_image;
  $('#member-tag').html( '<a href="/member.html"><img height="18" src= '+avatar + ' /> '+ data.result.member_nickname +'</a>');
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
  checkstatus();
}

if ($('#loginbutton')){
  $('#loginbutton').on('click', function(event){
    var email = $('#email').val();
    if (email == ''){
      return;
    }
    var password = $('#password').val();
    if (!validateEmail(email)){
      bootstrap_alert.warning('Please input correct email');
      event.preventDefault();
      return;
    }
    if (password === '' | password === undefined){
      bootstrap_alert.warning('Please input password');
      event.preventDefault();
      return;
    }
    if (!$('#readChecked').is(":checked")){
      bootstrap_alert.warning('Please Check the checkbox');
      event.preventDefault();
      return;
    }
    password = CryptoJS.SHA256('h@ppytvXXX' + password);
    console.log(password.toString(CryptoJS.enc.Hex));
    $.ajax({
      type: 'POST',
      headers: {
        "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba"
      },
      dataType: 'json',
      data: { "email": email, "password": password.toString(CryptoJS.enc.Hex) },
      url: 'https://api-stage.happytv.com.tw/happytvmember/login?source=email'
    }).done((data) => {
      if (data.retCode === 0){
        succuessLogin(data);
      }else{
        console.log('log in fail ' + data.retMessage);
      }
      
    }).fail((data) =>{
      console.log('log in fail');
    });
    event.preventDefault();
  });
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


function checkstatus(){
  if (Cookies.get("member_token") !== undefined){
    $('#loginArea').css('display', 'none');
    var searchParams = new URLSearchParams(window.location.search);
    var event = searchParams.get("event");
    $.ajax({
      type: 'GET',
      headers: {
      },
      dataType: 'json',
      data: { "email": email, "password": password.toString(CryptoJS.enc.Hex) },
      url: 'https://api-stage.happytv.com.tw/api/v3/promotion/event/' + searchParams.get("event")
    }).done((data) => {
      $('#promotion-code-area'+ event).css('display', 'block');
      $('#promtion-code-' + event).html(data.result.promotion_code);
    }).fail((data) =>{
      $('#no-more-promotion-code').css('display', 'block');
    });


  }else{
    $('#loginArea').css('display', 'block');
  }
}

$(document).ready(function(){
  checkstatus();
});