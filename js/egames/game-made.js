var tmp = {}
tmp.schedule_id = ''
tmp.made_by = ''
tmp.blue_id = ''
tmp.blue_name = ''
tmp.red_id = ''
tmp.red_name = ''

$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined) {
    getGameMadePageData()
  }else{
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
      $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
});

function getGameMadePageData (data) {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: happyApiHost + '/api/v3/egame/2018-01/getGameMadePageData/member_id/' + Cookies.get('member_id')
  }).done((data) => {
    if (data.result) {
      // red or blue
      var position = data.result.position
      var teamName = ''
      var opponentTeamName = ''

      // 紅藍方塊
      var blueCube = ''
      var redCube = ''

      // 我隊名, 敵隊名
      if(position === 'blue') {
        teamName = data.result.schedule.blue_name
        opponentTeamName = data.result.schedule.red_name
      } else if (position === 'red') {
        teamName = data.result.schedule.red_name
        opponentTeamName = data.result.schedule.blue_name
      }

      // 上方標題
      var teamDescript = '您的隊伍為「' + teamName + '」, 此輪對戰隊伍為「' + opponentTeamName + '」, 名單如下';
      $('#team-descript').html(teamDescript)

      // 敵隊名單
      data.result.opponent_team.forEach(function(member){
        var isTeamLeader = ''
        if(member.member_role === 0) {
          isTeamLeader = '<i class="fas fa-check-circle"></i>'
        }
        var trStr = '<tr><td class="table-title">' + isTeamLeader + '</td><td class="table-title">' + member.summoner + '</td></tr>'
        $('#enemy-tbody').append(trStr)
      })

      var myCube = ''
      var opCube = ''

      console.log(data.result.gameMade)

      makeCube()

      function makeCube() {
        // 第一次約戰
        if(!data.result.gameMade || !data.result.gameMade.first_date) {
          myCube = myCube + '<div class="lil-title">第一次約戰時間</div>' +
          '<div><form id="form_date_made"><input type="datetime-local" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
          return
        }

        // 第一次約戰確認
        if (data.result.gameMade.first_date && data.result.gameMade.first_date_confirm === null) {
          if (data.result.gameMade.first_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>'
            return
          } else {
            opCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>'
            myCube = '<div class="lil-title">第一次約戰時間確認</div>' +
              '<div><button id="btn_confirm_ok" class="btn_fighting">同意約戰時間</button></div>' +
              '<div><button id="btn_confirm_no" class="btn_fighting">無法配合該約戰時間</button></div>'
            return
          }
        }

        // 第一次約戰成功
        if(data.result.gameMade.first_date_confirm === 1) {
          if (data.result.gameMade.first_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 對手同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          }
          return
        }

        // 第一次約戰失敗
        if(data.result.gameMade.first_date_confirm === 0) {
          if (data.result.gameMade.first_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          }
        }

        // 加入第二次約戰input
        if(!data.result.gameMade.second_date) {
          myCube = myCube + '<div class="lil-title">第二次約戰時間</div>' +
          '<div><form id="form_date_made"><input type="datetime-local" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
        }

        // 第二次約戰確認
        if (data.result.gameMade.second_date && data.result.gameMade.second_date_confirm === null) {
          if (data.result.gameMade.second_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>'
          } else {
            opCube = opCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>'
            myCube = myCube + '<div class="lil-title">第二次約戰時間確認</div>' +
              '<div><button id="btn_confirm_ok" class="btn_fighting">同意約戰時間</button></div>' +
              '<div><button id="btn_confirm_no" class="btn_fighting">無法配合該約戰時間</button></div>'
              return
          }
        }

        // 第二次約戰成功
        if(data.result.gameMade.second_date_confirm === 1) {
          if (data.result.gameMade.second_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 對手同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          }

          return
        }

        // 第二次約戰失敗
        if(data.result.gameMade.second_date_confirm === 0) {
          if (data.result.gameMade.second_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          }
        }

        // 加入第三次約戰input
        if(!data.result.gameMade.third_date) {
          myCube = myCube + '<div class="lil-title">第三次約戰時間</div>' +
          '<div><form id="form_date_made"><input type="datetime-local" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
        }

        // 第三次約戰確認
        if (data.result.gameMade.third_date && data.result.gameMade.third_date_confirm === null) {
          if (data.result.gameMade.third_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>'
          } else {
            opCube = opCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>'
            myCube = myCube + '<div class="lil-title">第三次約戰時間確認</div>' +
              '<div><button id="btn_confirm_ok" class="btn_fighting">同意約戰時間</button></div>' +
              '<div><button id="btn_confirm_no" class="btn_fighting">無法配合該約戰時間</button></div>'
              return
          }
        }

        // 第三次約戰成功
        if(data.result.gameMade.third_date_confirm === 1) {
          if (data.result.gameMade.third_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 對手同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          }

          return
        }

        // 第三次約戰失敗
        if(data.result.gameMade.third_date_confirm === 0) {
          if (data.result.gameMade.third_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD hh:mm:ss') + '</div>' + '<hr>'
          }
        }


      }


      // 拼湊紅藍cube的html
      if(position === 'blue') {
        blueCube = myCube
        redCube = opCube
      } else if (position === 'red') {
        redCube = myCube
        blueCube = opCube
      }


      tmp.schedule_id = data.result.schedule.row_id
      tmp.made_by = position
      tmp.blue_id = data.result.schedule.blue_id
      tmp.blue_name = data.result.schedule.blue_name
      tmp.red_id = data.result.schedule.red_id
      tmp.red_name = data.result.schedule.red_name
      if(data.result.gameMade) {
        tmp.game_made_id = data.result.gameMade.row_id
      }

      // jquery 塞資料
      $('.blue-cube .big-title').text('藍方隊伍：' + data.result.schedule.blue_name)
      $('.red-cube .big-title').text('紅方隊伍：' + data.result.schedule.red_name)

      $('.blue-cube').append(blueCube)
      $('.red-cube').append(redCube)
    } else {
      alert('尚無對戰資料')
    }


  }).fail((jqXHR, textStatus ) => {
    alert('資料讀取失敗', jqXHR, textStatus)
  });

}

$(document).on('click', '#btn_confirm_ok', function(e) {
  e.preventDefault();

  var r = confirm("確定接受此約戰時間嗎?");
  if (r != true) {
    return
  }

  var data = {};
  data.confirm = 1
  data.confirm_by = tmp.made_by

  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + '/api/v3/egame/2018-01/gameMade/dateConfirm/' + tmp.game_made_id
  }).done(function(data)  {
    console.log(data)
    window.location.reload();
  }).fail(function(xhr, textStatus, error)  {
    console.log(xhr, error)

  });
})

$(document).on('click', '#btn_confirm_no', function(e) {
  e.preventDefault();

  var r = confirm("確定拒絕此約戰時間嗎?");
  if (r != true) {
    return
  }

  var data = {};
  data.confirm = 0
  data.confirm_by = tmp.made_by

  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + '/api/v3/egame/2018-01/gameMade/dateConfirm/' + tmp.game_made_id
  }).done(function(data)  {
    console.log(data)
    window.location.reload();
  }).fail(function(xhr, textStatus, error)  {
    console.log(xhr, error)

  });
})

$(document).on('submit', '#form_date_made', function(e) {
  e.preventDefault();

  var r = confirm("確定送出此約戰時間嗎?");
  if (r != true) {
    return
  }

  var data = {};
  data.date = $(this).children('input[name="made_time"]').val()
  data.schedule_id = tmp.schedule_id
  data.made_by = tmp.made_by
  data.blue_id = tmp.blue_id
  data.blue_name = tmp.blue_name
  data.red_id = tmp.red_id
  data.red_name = tmp.red_name

  var formData = new FormData();
  for ( var key in data ) {
    formData.append(key, data[key]);
  }
  console.log(data)
  console.log(formData)
  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + '/api/v3/egame/2018-01/gameMade/dateMade'
  }).done(function(data)  {
    console.log(data)
    window.location.reload();
  }).fail(function(xhr, textStatus, error)  {
    console.log(xhr, error)
  });
})