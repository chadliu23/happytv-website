
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
        url: 'https://api-product.happytv.com.tw/api/v3/egame/2018-01/verify/email/'+ getParameterByName('email') +
          '/requestcode/' +getParameterByName('requestcode') + 
          '/member/'+ Cookies.get('member_id')
      }).done((data) => {
        window.location.replace('register-interface-after.html');
      }).fail((data) => {
        window.location.replace('check-fault.html');
      })
    }else{
      window.location.replace('check-fault.html');
    }
  }
});
