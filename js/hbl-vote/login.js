


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
      $('.fb-button').css('display', 'none');
      $('.vote-area').css('display', 'block');
  }
});

var boyWinner = undefined;
var girlWinner = undefined;

function selectWinner(category,id){
  $('.'+category+'-winner').removeClass('selected');
  $('#' + category +'-winner-' + id).addClass('selected');

  if (category ==='boy'){
    boyWinner = id;
  }
  if (category === 'girl'){
    girlWinner = id;
  }
}

function submitWinner(){
  if (boyWinner === undefined){
    alert('請選擇男生組冠軍隊伍');
    return;
  }
  if (girlWinner === undefined){
    alert('請選擇女生組冠軍隊伍');
    return;
  }
  $.ajax({
    type: 'PUT',
    dataType: 'json',
    url: 'https://api-product.happytv.com.tw/api/v3/2017HBLB/winner/boy/'+ boyWinner+'/girl/'+ girlWinner +
      '/member/'+ Cookies.get('member_id')
  }).done((data) => {
    alert('感謝投票')
  }).fail((data) => {
    alert('1天只能投5次')
  })
}

function share2FB(category, team){
  FB.ui({
    method: 'share',
    href: 'https://www.happytv.com.tw/hbl-vote/winner.html',
    quote: team + "一定會拿下HBL乙級" + category + "全國冠軍",
    hashtag: '#happytv',
    mobile_iframe: true
  }, function(response){});
}
function share2FBStar(category, team, name){
  FB.ui({
    method: 'share',
    href: 'https://www.happytv.com.tw/hbl-vote/favorite-star.html',
    quote: "HBL乙級" + category+"【" + team +'  '+ name + "】是我的天菜",
    hashtag: '#happytv',
    mobile_iframe: true
  }, function(response){});
}

function submitStar(){
  if (boyWinner === undefined){
    alert('請選擇男生組天菜');
    return;
  }
  if (girlWinner === undefined){
    alert('請選擇女生組天菜');
    return;
  }
  $.ajax({
    type: 'PUT',
    dataType: 'json',
    url: 'https://api-product.happytv.com.tw/api/v3/2017HBLB/star/boy/'+ boyWinner+'/girl/'+ girlWinner +
      '/member/'+ Cookies.get('member_id')
  }).done((data) => {
    alert('感謝投票')
  }).fail((data) => {
    alert('一天只能投一次')
  })
}