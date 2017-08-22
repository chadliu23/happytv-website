


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
    if (Cookies.get("facebook_access_token") !== undefined){
        testAPI(Cookies.get("facebook_access_token"));
    }
  }(document, 'script', 'facebook-jssdk'));



  function loginFacebook() {
    FB.login(function(response){
        Cookies.set("facebook_access_token", response.authResponse.accessToken, 
           { expires: response.authResponse.expiresIn / (24* 60 *60) });
        window.location.replace("/member.html");
    });
}

function logout() {
    GoogleAuth = gapi.auth2.getAuthInstance();
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
      window.location.replace("/index.html");
    }else{
        FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            FB.logout(function(response) {
             $('#member-tag').html('');
             $('#member-tag').css('display', 'none');
             $('#login-tag').html('<a href="login.html"><i class="fa fa-1x fa-sign-in" aria-hidden="true"></i>登入</a>');
             Cookies.remove('facebook_access_token');
             window.location.replace("/index.html");
            });
          } else{
            $('#login-tag').html('<a href="login.html"><i class="fa fa-1x fa-sign-in" aria-hidden="true"></i>登入</a>');
            $('#member-tag').html('');
            $('#member-tag').css('display', 'none');
            Cookies.remove('facebook_access_token');
            window.location.replace("/index.html");
          }
          
            
        });

    }
}


  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI(accessToken) {
    if (!accessToken) {
        return;
    }

    $.get('https://graph.facebook.com/'+facebook_api_version+'/me?access_token='+ accessToken, function(data){
        if (data.name === undefined){
            console.log('access token expired @ testAPI : ' + data);
            Cookies.remove("facebook_access_token");
            return;
        }
        $('#member-tag').css('display', 'block');
        var avatar =  "https://graph.facebook.com/" + data.id + "/picture";
        $('#member-tag').html( '<a href="/member.html"><img height="18" src= '+avatar + ' /> '+ data.name +'</a>');
        $('#login-tag').html( '<a onclick="logout()">' + '登出</a>');
        if ($('#username') !== undefined){
            $('#username').html(data.name);
        }
    });
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
    } else {
      // User is not signed in. Start Google auth flow.
      onSignIn = true;
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized && onSignIn){
      window.location.replace("/member.html");
    }
    else if (isAuthorized) {

        $('#member-tag').css('display', 'block');
        var profile = user.getBasicProfile();
        var avatar =  profile.getImageUrl();
        $('#member-tag').html( '<a href="/member.html"><img height="18" src= '+avatar + ' /> '+ profile.getName() +'</a>');
        $('#login-tag').html( '<a onclick="logout()">' + '登出</a>');
        if ($('#username') !== undefined){
            $('#username').html(profile.getName());
        }

        //TODO send back to backend to get h money
        console.log(user.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    } else {

      FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
          }
          else{
            $('#member-tag').html('');
            $('#member-tag').css('display', 'none');
            $('#login-tag').html('<a href="login.html"><i class="fa fa-1x fa-sign-in" aria-hidden="true"></i>登入</a>');
          }
        });
        
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }

bootstrap_alert = function() {}
bootstrap_alert.warning = function(message) {
            $('#alert_placeholder').html('<div id="alertEmail" class="alert alert-danger fade"><a class="close" data-dismiss="alert">×</a><span>'+message+'</span></div>')
        }
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
      $("#alertEmail").addClass("in")
      $("#alertEmail").fadeTo(2000, 500).slideUp(500, function(){
          $("#alertEmail").slideUp(500);
      });
      event.preventDefault();
      return;
    }
    if (password === '' | password === undefined){
      bootstrap_alert.warning('Please input password');
      $("#alertEmail").addClass("in")
      $("#alertEmail").fadeTo(2000, 500).slideUp(500, function(){
          $("#alertEmail").slideUp(500);
      });
      event.preventDefault();
      return;
    }
    if (!$('#readChecked').is(":checked")){
      bootstrap_alert.warning('Please Check the checkbox');
      $("#alertEmail").addClass("in")
      $("#alertEmail").fadeTo(2000, 500).slideUp(500, function(){
          $("#alertEmail").slideUp(500);
      });
      event.preventDefault();
      return;
    }

  });
}
