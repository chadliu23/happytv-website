$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined) {
  	var data = {
  		group: 'A'
  	}

    $.ajax({
      type: 'GET',
      data: data,
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/schedule'
    }).done((data) => {
    	var a =  JSON.stringify(data)
    	alert(a)

    	if (data && data.result) {
    		data.result.forEach((schedule) => {
    			var a = $("td.order-" + schedule.progress_order+".progress-" + schedule.game_progress)
    			a.children("input.team-blue").val(schedule.blue_name)
    			a.children("input.team-red").val(schedule.red_name)
    			console.log(a.length)
    		})
    	}

    	// {"retCode":0,"retMessage":"","result":[{
    	// 	"row_id":"1","blue_id":"bbc6dc24870c7ecc6ba7d7d93f1c95bccbb918f4",
    	// 	"red_id":"12345","blue_name":"快樂電視","red_name":"十全科技",
    	// 	"winner":null,"group":"A","game_progress":1,"progress_order":2,
    	// 	"game_date":null,"result_photo":"","update_time":"2018-05-16T09:22:07.000Z"}]}






     // window.location.replace('register-interface-after.html');
    }).fail((jqXHR, textStatus ) => {
    	alert('資料讀取失敗', jqXHR, textStatus)
    });
  }else{
    $('#openModal').css({ 'display': 'block' });
        setTimeout(function() {
            $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }, 500);
  }
});