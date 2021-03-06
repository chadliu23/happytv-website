
$(document).ready(function(callback) {
    if (Cookies.get("member_token") === undefined){
        window.location('/login.html');
        return;
    }

    $.ajax({
        type: 'GET',
        headers: {
          "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
        },
        dataType: 'json',
        url: 'https://api-product.happytv.com.tw/api/v3/billing/provider/GASH/items'
      }).done(function(data)  {
        for ( let key in data.result){
            $('<div/>').loadTemplate($("#hpoint-template"), data.result[key]).appendTo("#item_list");
            $("#" + data.result[key].hpoint_item_id).on('click', function(event){
                 $.ajax({
                    type: 'POST',
                    headers: {
                      "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
                      "membertoken":Cookies.get('member_token'),
                      "memberid":Cookies.get('member_id')
                    },
                    dataType: 'json',
                    url: 'https://api-product.happytv.com.tw/api/v3/billing/provider/GASH/place_order/' + event.currentTarget.id
                  }).done(function(data)  {
                    var input = $("<input>")
                                   .attr("type", "hidden")
                                   .attr("name", "data")
                                   .val(data.result.data);
                    $('form')
                        .attr('action', data.result.link)
                        .attr('method', 'POST')
                        .html(input).submit();
                    

                  }).fail(function(data) {
                    console.log('cannot get member point');
                  });

                
            })
        }
      }).fail(function(data) {
        console.log('cannot get gash items');
      });
      $.ajax({
        type: 'GET',
        headers: {
          "accesskey": "accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp",
          "membertoken":Cookies.get('member_token'),
          "memberid":Cookies.get('member_id')
        },
        dataType: 'json',
        url: 'https://api-product.happytv.com.tw/api/v3/billing/getBalance'
      }).done(function(data)  {
        $('#memberPoint').prepend(data.result);
      }).fail(function(data) {
        console.log('cannot get member point');
      });
});