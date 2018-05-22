
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
  if (Cookies.get("member_token") !== undefined  ){
    if (getParameterByName('email') !== null && getParameterByName('requestcode') !== null){
      $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: happyApiHost + '/api/v3/egame/2018-01/verify/email/'+ getParameterByName('email') +
          '/requestcode/' +getParameterByName('requestcode') +
          '/member/'+ Cookies.get('member_id')
      }).done((data) => {
        $('.message').html('認證成功');
        alert('認證成功! 帳號已與報名資料連結, 將導回活動頁面')
        window.location.replace('signup.html');
      }).fail((data) => {
        $('.message').html('認證失敗');
        alert('認證失敗, 請確認是否為正確的信箱中驗證網址, 且已認證成功之帳號不可重複認證')
      })
    }else{
      $('.message').html('認證失敗');
      alert('認證失敗, 邀請連結損毀, 請確認是否為正確的信箱中驗證網址')
    }
  } else {
    $('.message').css('display', 'none');
    $('.fb').css('display', 'block');
  }
});
