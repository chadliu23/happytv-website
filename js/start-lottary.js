
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



loadCSS = function(href) {

  var cssLink = $("<link>");
  $("head").append(cssLink); //IE hack: append before setting href

  cssLink.attr({
    rel:  "stylesheet",
    type: "text/css",
    href: href
  });

};


$(document).ready(function(){
  var searchParams = new URLSearchParams(window.location.search);
  var event = searchParams.get("event");
  loadCSS("/css/lottary.css");

  $('#start-button').on('click', (event) => {
    var searchParams = new URLSearchParams(window.location.search);
    var event = searchParams.get("event");
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'https://api-stage.happytv.com.tw/api/v3/promotion/event/' + searchParams.get("event") + '/number/' + $('#number')[0].value
    }).done((data) => {
      $('#promotion-code-area').css('display', 'block');
      $('#promotion-click').css('display', 'none');
      for (let i in data){
        $('#promotion-code-area').append('<ul>' +(Number(i)+1) + '. ' + data[i].nick_name + '</ul>');
      }
    }).fail((data) =>{
      $('#promotion-code-area').css('display', 'block');
      $('#start-button').css('display', 'none');
      console.log(data);
    });
  })
});