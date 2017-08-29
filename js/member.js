
$(document).ready((callback) =>{
    if (Cookies.get("member_token") === undefined){
        window.location('/login.html');
        return;
    }

    $.ajax({
        type: 'GET',
        headers: {
          "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
          "Access-Control-Allow-Origin":"http://172.18.1.86:8000",
        },
        dataType: 'json',
        url: 'https://api-stage.happytv.com.tw/billing/v1/provider/GASH/items'
      }).done((data) => {
        for ( let key in data.result){
            $('<div/>').loadTemplate($("#hpoint-template"), data.result[key]).appendTo("#item_list");
            $("#" + data.result[key].hpoint_item_id).on('click', (event) =>{
                 $.ajax({
                    type: 'POST',
                    headers: {
                      "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
                      "Access-Control-Allow-Origin":"http://172.18.1.86:8000",
                      "membertoken":Cookies.get('member_token'),
                      "memberid":Cookies.get('member_id')
                    },
                    dataType: 'json',
                    url: 'https://api-stage.happytv.com.tw/billing/v1/provider/GASH/place_order/' + event.currentTarget.id
                  }).done((data) => {
                    var input = $("<input>")
                                   .attr("type", "hidden")
                                   .attr("name", "data")
                                   .val(data.result.data);
                    $('form')
                        .attr('action', data.result.link)
                        .attr('method', 'POST')
                        .html(input).submit();
                    

                  }).fail((data) =>{
                    console.log('cannot get member point');
                  });

                
            })
        }
      }).fail((data) =>{
        console.log('cannot get gash items');
      });
      $.ajax({
        type: 'GET',
        headers: {
          "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
          "Access-Control-Allow-Origin":"http://172.18.1.86:8000",
          "membertoken":Cookies.get('member_token'),
          "memberid":Cookies.get('member_id')
        },
        dataType: 'json',
        url: 'https://api-stage.happytv.com.tw/billing/v1/getBalance'
      }).done((data) => {
        $('#memberPoint').prepend(data.result);
      }).fail((data) =>{
        console.log('cannot get member point');
      });
});