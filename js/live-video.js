function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  return false;
}


var publish_channel = '';
var mqtt_client = undefined;


function sendMessage(){
  if (!Cookies.get("member_id")){
    alert('Please login first');
    return;
  }
  let now = new Date();
  let obj = {
    from : Cookies.get('member_nickname'),
    channel_id: getParameterByName('channel_id'),
    level: 'VIP', 
    message:$('#btn-input')[0].value,
    date: now.toISOString(),
    member_image: Cookies.get('member_image'),
    member_id: Cookies.get('member_id'),
    type: '1'
  }
  if (mqtt_client == undefined || publish_channel === ''){
    return;
  }
  mqtt_client.publish(publish_channel, JSON.stringify(obj));
  $('#btn-input')[0].value = '';
}


$(document).ready(()=> {
  var channel_id = getParameterByName('channel_id');
  let header = {
      'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
    };
  if (Cookies.get("member_token") !== undefined){
      header['membertoken'] = Cookies.get("member_token");
  }
  if (Cookies.get("member_id") !== undefined){
      header['memberid'] = Cookies.get("member_id");
  }
  
   $.ajax({
    type: 'GET',
    headers: header,
    url: "https://api-product.happytv.com.tw/api/v3/channels/" + channel_id +'/web-join',
  }).done((data) => {
    console.log(data);
      var hls;
      
      var video = $('#video')[0];
      if(!Hls.isSupported()) {
        $('#video').attr('width', '100%');
        $('#video').attr('src', data.result.source);
      }else{
        hls = new Hls();
        hls.loadSource(data.result.source);
        hls.attachMedia(video);
        $('#video').attr('width', '100%');
        $('.msg_container_base').css('max-height', $('#video')[0].offsetHeight + 25);
        
      }
      
      $('#title').text(data.result.channel_name);

      publish_channel = data.result.pub_topic;
      mqtt_client  = mqtt.connect('wss://' + data.result.mqtt_server, {
        username: data.result.user_name, 
        password: data.result.password,
        port:  parseInt(data.result.mqtt_port)+1,
        host: data.result.mqtt_server
      });


      mqtt_client.on('connect', function () {
        console.log('connected');
        mqtt_client.subscribe(data.result.sub_topic);
        $('#btn-input').removeAttr('disabled');
        //client.publish('presence', 'Hello mqtt')
      })

      mqtt_client.on('message', function (topic, message) {
        let obj ={}
        try{
          let a = message.toString();
          if (a.charCodeAt(a.length -1) == 0) {
              a = a.substring(0, a.length -1);
          }
          obj = JSON.parse(a);
          let image = obj.member_image;
          if (image === undefined || image === null || image === ''){
            image = 'http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg';
          }
          var date = moment(obj.date);
          let isAtBottom = false;
          if ($('#chatroom_chat')[0].scrollHeight - $('#chatroom_chat')[0].scrollTop === $('#chatroom_chat')[0].clientHeight){
            isAtBottom = true;
          }
          if (obj.member_id == Cookies.get("member_id") ){
            $('#chatroom_chat').append(
              '<div class="row msg_container base_sent">'+
              '<div class="col-md-10 col-xs-10">' +
                '<div class="messages msg_sent">' + 
                  '<p style="word-break: break-word;">'+obj.message+'</p>' + 
                  '<time datetime="'+obj.date+'">' + obj.from + '@ '+ date.local().format('YYYY-MM-DD HH:mm:ss') +  '</time>'+
                '</div>'+
              '</div>'+
                '<div class="col-md-2 col-xs-2 avatar">' +
                  '<img src="'+ image +'" class=" img-responsive ">' +
                '</div>'+
              '</div>'  
            );
          }else{
            $('#chatroom_chat').append(
              '<div class="row msg_container base_receive">'+
              '<div class="col-md-2 col-xs-2 avatar">' +
              '<img src="'+ image +'" class=" img-responsive ">' +
              '</div>'+
              '<div class="col-xs-10 col-md-10">' +
              '<div class="messages msg_receive">'+
              '<p style="word-break: break-word;">'+obj.message+'</p>' + 
              '<time datetime="'+obj.date+'">' + obj.from +'@ '+ date.local().format('YYYY-MM-DD HH:mm:ss') +  '</time></div></div></div>'  
            );
          }
          if (isAtBottom){
            $('#chatroom_chat')[0].scrollTop = $('#chatroom_chat')[0].scrollHeight;
          }
        } catch (e) {
          console.log(e);
        
        }
      })

  }).fail((jqXHR, textStatus, errorThrown) => {
    window.location = ('/login.html?redirect='+ window.location);
  });
  $('#btn-chat').on('click', (event) => {
    sendMessage();
  });
  $('#btn-input').keypress(function(e) {
    if(e.which == 13) {
        sendMessage();
    }
  });
});

window.onresize = function(event) {
    $('.msg_container_base').css('max-height', $('#video')[0].offsetHeight );
};

