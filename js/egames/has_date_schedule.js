$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined) {
    getScheduleData()
  }else{
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
      $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
});

function getScheduleData (data) {
  $.ajax({
    type: 'GET',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    url: happyApiHost + '/api/v3/egame/2018-01/gameSchedule/has_game_date/all'
  }).done((data) => {
    if (data.result) {
      console.log(data.result)

      var allTr = ''
      data.result.forEach(function(schedule, i){
        var tr = '<tr>' + '<td>' + (i+1) + '</td>' + '<td>' + schedule.blue_name + '</td>'+
        '<td>' + schedule.red_name + '</td>'+ '<td>' + moment(schedule.game_date).format('YYYY/MM/DD HH:mm') + '</td>'
        + '</tr>'

        allTr += tr
      })

      $('#schedule-list').append(allTr)

    } else {
      console.log('no data')
    }
  }).fail((jqXHR, textStatus ) => {
    alert('資料讀取失敗', jqXHR, textStatus)
  });

}



