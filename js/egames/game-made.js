$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined) {
  	var data = {
  		group: 'A'
  	}

    getGameMadePageData()
  }else{
    $('#openModal').css({ 'display': 'block' });
        setTimeout(function() {
            $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }, 500);
  }
});


function getGameMadePageData (data) {
  // 要用ajax抓
  // var game_progress = 1
  // var group = 'A'
  // var
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: happyApiHost + '/api/v3/egame/2018-01/gameMadePageData/' + Cookies.get('member_id')
  }).done((data) => {
    // var a =  JSON.stringify(data)
    // alert(a)

    if (data && data.result) {
      var teamDescript = '您的隊伍為「' + data.result.team_name + '」, 此輪對戰隊伍為「' + data.result.opponent_team_name + '」, 名單如下';
      $('#team-descript').html(teamDescript)

      data.result.opponent_team_members.forEach(function(member){
        var isTeamLeader = '否'
        if(member.member_role === 0) {
          isTeamLeader = '是'
        }
        var trStr = '<tr><td class="table-title">' + isTeamLeader + '</td><td class="table-title">' + member.summoner + '</td></tr>'
        $('#enemy-tbody').append(trStr)
      })

    }


  }).fail((jqXHR, textStatus ) => {
    alert('資料讀取失敗', jqXHR, textStatus)
  });

}