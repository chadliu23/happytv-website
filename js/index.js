$.ajax({
  type: 'GET',
  headers: {
    "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
  },
  dataType: 'json',
  url: 'https://api-product.happytv.com.tw/api/v3/web-menu/all'
}).done((data) => {
  

  data.result.forEach((item)=>{
      $('#list').append(
        '<div id="'+item.id+'" class="menu">' +
          '<div class="title">' +
          '<div class="container">' +
            '<h1 class="wow fadeInUp">'+ item.title + '</h1>' +
          "</div>" +
          '</div>' +
          '<div class="content">' +
            '<div class="container">' +
              '<div id="'+item.id +'-content'+'" class="row">'+
              '</div>' +
            '</div>' +
          '</div>' +
          
        "</div>"
        );
      
      $.ajax({
        type: 'GET',
        headers: {
          "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
        },
        dataType: 'json',
        url: 'https://api-product.happytv.com.tw/api/v3/web-menu/' + item.id + "/status/on?currentPage=1&pageSize=100&language=zh-tw"
      }).done((channels) => {
        if (channels.result.forEach){
          let channelDom ='';
          channels.result.forEach((channel) => {
            channelDom += 
            '<div class="col-sm-4">' +
              '<div class="image">'+
                '<a href="/live/game.html?channel_id='+channel.channel_id+'">' + 
                '<img src="'+channel.image_path+'" class="wow fadeInUp"></a>' + 
              '</div>'  +
              '<div class="text">' +
                '<h2 class="wow fadeInUp">' + channel.channel_name + 
                    '<p class="wow fadeInUp">' + channel.click_count + '</p>' +
                '</h2>' +
              '</div>'+
            '</div>';
            
          });
          $('#'+ item.id +'-content').append(channelDom);
        }
      });
  });
}).fail((data) =>{
  console.log(data);
});