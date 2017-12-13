$(document).ready(() => {
    $.ajax({
        type: 'GET',
        headers: {
          'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
        },
        url: "https://api-product.happytv.com.tw/api/v3/channels/main-menu-id/d14c43c2/status/on?pageSize=999"
    }).done((data) => {
        console.log(data);
        data.result.forEach((item)=>{
            let category_name = item.category_name;
            $('#list').append("<div class='tab-content col-lg-12' id='"+item.category_id +"'><h2>"+item.category_name+"</h2></div>");
            item.channelList.forEach((channel) => {
                $('#'+item.category_id).append("<div class='col-md-3'>" +
                    "<a href='live-video.html?channel_id="+channel.channel_id+"' data-toggle='tooltip' data-placement='bottom'>"+
                    "<div style='height:160px'><img class='img-responsive' src='"+channel.image_path+"' alt=''> </div>" +
                    "</a>"+
                    "<h3><i class='fa fa-hand-o-right' aria-hidden='true'></i>"+channel.channel_name+"</h3></div>");
            }) 
            
        });
    }).fail((data) => {
        console.log(data);
    })

});