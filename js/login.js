  function handleLineAuthClick(){
    window.location = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1538014608&redirect_uri='+
    encodeURIComponent('https://api-product.happytv.com.tw/happytvmember/login/callback') + '&state=rEeTqQ6zmnt7vETM&scope=openid%20profile';
  }

  AccountKit_OnInteractive = function(){
      AccountKit.init(
        {
          appId:"1737378749850147",
          state:" ",
          version:"v1.1",
          fbAppEventsEnabled:true
        }
      );

  };
  // phone form submission handler
  function smsLogin() {
    let countryCode = document.getElementById("country_code").value;
    let phoneNumber = document.getElementById("phone_number").value;
    AccountKit.login(
      'PHONE',
      {countryCode: countryCode, phoneNumber: phoneNumber}, // will use default values if not specified
      loginCallback
    );
  }
          // login callback
          function loginCallback(response) {
              console.log(response)
            if (response.status === "PARTIALLY_AUTHENTICATED") {
              $.ajax({
                type: 'post',
                dataType: 'json',
                headers: {
                  "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp"
                },
                data:{
                  "account_code": response.code
                },
                url: 'https://api-product.happytv.com.tw/happytvmember/login?source=accountkit&mode=homepage'

              }).done(function(data)  {
                succuessLogin(data)
              }).fail(function(data) {
                bootstrap_alert.warning('Phone number fails to register.');
              });

            }

            else if (response.status === "NOT_AUTHENTICATED") {
              // handle authentication failure
            }
            else if (response.status === "BAD_PARAMS") {
              // handle bad parameters
            }
          }


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
              "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp"
            },
            dataType: 'json',
            data: { "fb_id": data.id, "fb_token": response.authResponse.accessToken },
            url: 'https://api-product.happytv.com.tw/happytvmember/login?source=facebook&mode=homepage'
          }).done(function(data)  {
            succuessLogin(data);
          }).fail(function(data) {
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

    GoogleAuth = gapi.auth2.getAuthInstance();
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();

    }
    window.location.replace("/index.html");
}

  var GoogleAuth;
  var SCOPE = 'openid profile email';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyCR9ChiUrdrAODjcXO3aYznoGk509q-0Yo',
        'discoveryDocs': [discoveryUrl],
        'clientId': '34494465314-ot8gvaav06kh0sibt2gja9kmpoavtpfg.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      // $('#sign-in-or-out-button').click(function() {
      //   handleAuthClick();
      // });
      // $('#revoke-access-button').click(function() {
      //   revokeAccess();
      // });
    });
  }
  var onSignIn = false;

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    }
    onSignIn = true;
    GoogleAuth.signIn();

  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    if (Cookies.get("member_token") !== undefined){
      return ;
    }
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized && onSignIn){
      $.ajax({
        type: 'POST',
        headers: {
          "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
        },
        dataType: 'json',
        data: { "google_id_token": user.getAuthResponse().id_token, "google_access_token": user.getAuthResponse().access_token  },
        url: 'https://api-product.happytv.com.tw/happytvmember/login?source=google&mode=homepage'
      }).done(function(data)  {
        succuessLogin(data);
      }).fail(function(data) {
        bootstrap_alert.warning('This Google account as not register.');
        GoogleAuth.signOut();
      });
    }else if(isAuthorized){
      // google sign on
    }else{
      // google not sign in
    }
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
  window.location.replace("/member.html");
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
      return;
    }
    if (!$('#readChecked').is(":checked")){
      return;
    }
    password = CryptoJS.SHA256('h@ppytvXXX' + password);
    console.log(password.toString(CryptoJS.enc.Hex));
    $.ajax({
      type: 'POST',
      headers: {
        "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
      },
      dataType: 'json',
      data: { "email": email, "password": password.toString(CryptoJS.enc.Hex) },
      url: 'https://api-product.happytv.com.tw/happytvmember/login?source=email&mode=homepage'
    }).done(function(data) {
      succuessLogin(data);
    }).fail(function(data) {
      bootstrap_alert.warning('Login fail');
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

$(document).ready(function(){

  var line_access_token = getParameterByName("line_access_token");
  var line_id = getParameterByName("line_id");
  if (line_access_token !== undefined && line_id != undefined){
    $.ajax({
      type: 'POST',
      headers: {
        "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
      },
      dataType: 'json',
      data: { "line_access_token": line_access_token, "line_id": line_id },
      url: 'https://api-product.happytv.com.tw/happytvmember/login?source=line&mode=homepage'
    }).done(function(data)  {
      succuessLogin(data);
    }).fail(function(data) {
      bootstrap_alert.warning('Login fail');
    });
  }

  if (Cookies.get("member_token") !== undefined){
      $('#member-tag').css('display', 'block');
        var avatar =  Cookies.get('member_image');
        $('#member-tag').html( '<a href="/member.html"><img height="18" src= '+avatar + ' /> '+ Cookies.get('member_nickname') +'</a>');
        $('#login-tag').html( '<a onclick="logout()">' + '登出</a>');
        if ($('#username') !== undefined){
            $('#username').html(Cookies.get('member_nickname') + ' ( ID: ' + Cookies.get('member_id')+ ')');
        }
  }
});
