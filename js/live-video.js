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



$(document).ready(()=> {
  var channel_id = getParameterByName('channel_id');
   $.ajax({
    type: 'GET',
    headers: {
      'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
    },
    url: "https://api-product.happytv.com.tw/api/v3/channels/" + channel_id +'/web-join'
  }).done((data) => {
    console.log(data);
      var hls;
      
      var video = $('#video')[0];
      if (iOS()){
        $('#video').attr('width', '100%');
        $('#video').attr('src', data.result.source);
      }else{
        hls = new Hls();
        hls.loadSource(data.result.source);
        hls.attachMedia(video);
        $('#video').attr('height', '480px');
        $('#video').attr('width', '854px');
      }
      
      $('#title').text(data.result.channel_name);
  }).fail((data) => {
    debugger;
    console.log(data);
  });

  
});

