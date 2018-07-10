var tmp = {}
tmp.schedule_id = ''
tmp.made_by = ''
tmp.blue_id = ''
tmp.blue_name = ''
tmp.red_id = ''
tmp.red_name = ''
tmp.user_is_leader = false

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

      //要不要通知雙方line@聯絡官方
      var alertLine = false

      // 我隊名, 敵隊名
      if(position === 'blue') {
        teamName = data.result.schedule.blue_name
        opponentTeamName = data.result.schedule.red_name
      } else if (position === 'red') {
        teamName = data.result.schedule.red_name
        opponentTeamName = data.result.schedule.blue_name
      }

      // 上方標題
      var teamDescript = '您的隊伍為「' + teamName + '」, 此輪對戰隊伍為「' + opponentTeamName + '」';
      $('#team-descript').html(teamDescript)

      // 藍方
      data.result.opponent_team.forEach(function(member, i){
        var isTeamLeader = ''
        if(member.member_role === 0) {
          isTeamLeader = ' (<span style="color: orange">隊長</span>)'
        }

        var num = i + 1
        var trStr = '<p>' + num + '.' + member.summoner + isTeamLeader + '</p>'

        if(position === 'red') {
          $('.cube-one').append(trStr)
        } else {
          $('.cube-four').append(trStr)
        }
      })

      // 紅方
      data.result.our_team.forEach(function(member, i){
        var isTeamLeader = ''
        if(member.member_role === 0) {
          isTeamLeader = ' (<span style="color: orange">隊長</span>)'
        }

        var num = i + 1
        var trStr = '<p>' + num + '.' + member.summoner + isTeamLeader + '</p>'

        if(position === 'red') {
          $('.cube-four').append(trStr)
        } else {
          $('.cube-one').append(trStr)
        }
      })

      var myCube = ''
      var opCube = ''

      console.log(data.result.gameMade)

      makeCube()

      function makeCube() {
        // 第一次約戰
        if(!data.result.gameMade || !data.result.gameMade.first_date) {
          myCube = myCube + '<div class="lil-title">第一次約戰時間</div>' +
          '<div><form id="form_date_made"><input id="date-pick" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
          return
        }

        // 第一次約戰確認
        if (data.result.gameMade.first_date && data.result.gameMade.first_date_confirm === null) {
          if (data.result.gameMade.first_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
            return
          } else {
            opCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
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
            myCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }
          return
        }

        // 第一次約戰失敗
        if(data.result.gameMade.first_date_confirm === 0) {
          if (data.result.gameMade.first_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第一次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第一次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.first_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }
        }

        // 加入第二次約戰input
        if(!data.result.gameMade.second_date && data.result.gameMade.first_date_made_by !== position) {
          myCube = myCube + '<div class="lil-title">第二次約戰時間</div>' +
          '<div><form id="form_date_made"><input id="date-pick" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
          return
        } else if (!data.result.gameMade.second_date && data.result.gameMade.first_date_made_by === position) {
          myCube = myCube + '<div class="lil-title">等待對手約戰</div>'
          return
        }

        // 第二次約戰確認
        if (data.result.gameMade.second_date && data.result.gameMade.second_date_confirm === null) {
          if (data.result.gameMade.second_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.second_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
            return
          } else {
            opCube = opCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.second_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
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
            myCube = myCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.second_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.second_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }

          return
        }

        // 第二次約戰失敗
        if(data.result.gameMade.second_date_confirm === 0) {
          if (data.result.gameMade.second_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.second_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第二次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第二次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.second_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }
        }

        // 加入第三次約戰input
        if(!data.result.gameMade.third_date && data.result.gameMade.second_date_made_by !== position) {
          myCube = myCube + '<div class="lil-title">第三次約戰時間</div>' +
          '<div><form id="form_date_made"><input id="date-pick" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
          return
        } else if (!data.result.gameMade.third_date && data.result.gameMade.second_date_made_by === position) {
          myCube = myCube + '<div class="lil-title">等待對手約戰</div>'
          return
        }

        // 第三次約戰確認
        if (data.result.gameMade.third_date && data.result.gameMade.third_date_confirm === null) {
          if (data.result.gameMade.third_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.third_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
            return
          } else {
            opCube = opCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.third_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
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
            myCube = myCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.third_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.third_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }

          return
        }

        // 第三次約戰失敗
        if(data.result.gameMade.third_date_confirm === 0) {
          if (data.result.gameMade.third_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.third_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第三次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第三次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.third_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }
        }


        // 加入第四次約戰input
        if(!data.result.gameMade.fourth_date && data.result.gameMade.third_date_made_by !== position) {
          myCube = myCube + '<div class="lil-title">第四次約戰時間</div>' +
          '<div><form id="form_date_made"><input id="date-pick" name="made_time"><button class="btn_fighting" type="submit">送出</button></form></div>'
          return
        } else if (!data.result.gameMade.fourth_date && data.result.gameMade.third_date_made_by === position) {
          myCube = myCube + '<div class="lil-title">等待對手約戰</div>'
          return
        }

        // 第四次約戰確認
        if (data.result.gameMade.fourth_date && data.result.gameMade.fourth_date_confirm === null) {
          if (data.result.gameMade.fourth_date_made_by === position) {
            myCube = myCube + '<div class="lil-title">第四次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.fourth_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
          } else {
            opCube = opCube + '<div class="lil-title">第四次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.fourth_date).format('YYYY-MM-DD HH:mm:ss') + '</div>'
            myCube = myCube + '<div class="lil-title">第四次約戰時間確認</div>' +
              '<div><button id="btn_confirm_ok" class="btn_fighting">同意約戰時間</button></div>' +
              '<div><button id="btn_confirm_no" class="btn_fighting">無法配合該約戰時間</button></div>'
            return
          }
        }

        // 第四次約戰成功
        if(data.result.gameMade.fourth_date_confirm === 1) {
          if (data.result.gameMade.fourth_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第四次約戰時間確認</div>' + '<div>『 對手同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第四次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.fourth_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第四次約戰時間確認</div>' + '<div>『 您同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第四次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.fourth_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }

          return
        }

        // 第四次約戰失敗
        if(data.result.gameMade.fourth_date_confirm === 0) {
          if (data.result.gameMade.fourth_date_made_by === position) {
            opCube = opCube + '<div class="lil-title">第四次約戰時間確認</div>' + '<div>『 對手不同意 』</div>' + '<hr>'
            myCube = myCube + '<div class="lil-title">第四次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.fourth_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          } else {
            myCube = myCube + '<div class="lil-title">第四次約戰時間確認</div>' + '<div>『 您不同意 』</div>' + '<hr>'
            opCube = opCube + '<div class="lil-title">第四次約戰時間</div><div>約戰時間：' + moment(data.result.gameMade.fourth_date).format('YYYY-MM-DD HH:mm:ss') + '</div>' + '<hr>'
          }

          alertLine = true;
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
      tmp.user_is_leader = data.result.is_leader
      if(data.result.gameMade) {
        tmp.game_made_id = data.result.gameMade.row_id
      }

      // jquery 塞資料
      $('.blue-cube .big-title').html('藍方隊伍<br />' + data.result.schedule.blue_name)
      $('.red-cube .big-title').html('紫方隊伍<br />' + data.result.schedule.red_name)

      $('.blue-cube').append(blueCube)
      $('.red-cube').append(redCube)

      // 三次約戰失敗顯示alert
      if(alertLine) {
        alert('四次約戰皆失敗, 請聯絡官方Line @JDH4282L 由官方協助')
      }

      // 設定date time picker
      var today = moment().format('MM.DD.YYYY')
      $.datetimepicker.setLocale('zh-TW');
      jQuery('#date-pick').datetimepicker({
        datepicker: true,
        // allowTimes: [
        //   '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00',
        //   '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00',
        //   '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00',
        //   '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15',
        //   '23:30', '23:45', '00:00'
        // ],
        allowTimes: [
          '09:00', '10:00',  '11:00', '15:00', '16:00', '17:00',
          '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
        ],
        disabledWeekDays: [1],
        disabledDates: [today],
        formatDate: 'm.d.Y',
        theme:'dark',
        mask:true,
      });

    } else {
      alert('尚無對戰資料')
    }


  }).fail((jqXHR, textStatus ) => {
    alert('資料讀取失敗', jqXHR, textStatus)
  });

}

$(document).on('click', '#btn_confirm_ok', function(e) {
  e.preventDefault();

  if(!tmp.user_is_leader) {
    return alert('只有隊長能夠使用此功能')
  }

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

  if(!tmp.user_is_leader) {
    return alert('只有隊長能夠使用此功能')
  }

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
    if(data.retMessage === 'date invalid') {
      alert('因約戰的時間必須大於今天, 系統已取消這筆約戰, 請再重新操作')
    }

    window.location.reload();
  }).fail(function(xhr, textStatus, error)  {
    console.log(xhr, error)

  });
})

$(document).on('submit', '#form_date_made', function(e) {
  e.preventDefault();

  if(!tmp.user_is_leader) {
    return alert('只有隊長能夠使用此功能')
  }

  var date = $(this).children('input[name="made_time"]').val()
  date = moment(date, 'YYYY/MM/DD HH:mm')

  if(date.day() === 1) {
    return alert('※不可選擇星期一')
  }

  var round = null
  var now = moment()

  if(now.isBetween(moment('2018/07/10', 'YYYY/MM/DD'), moment('2018/07/15', 'YYYY/MM/DD'), null, '[]')) {
    round = 2
  }

  if(now.isBetween(moment('2018/07/16', 'YYYY/MM/DD'), moment('2018/07/22', 'YYYY/MM/DD'), null, '[]')) {
    round = 3
  }

  if(now.isBetween(moment('2018/07/23', 'YYYY/MM/DD'), moment('2018/07/29', 'YYYY/MM/DD'), null, '[]')) {
    round = 4
  }

  switch(round) {
    case 2:
      if(date.date() > 15 || date.date() < 10) {
        return alert('※第二輪賽事請選擇10~15號')
      }
      break;
    case 3:
      if(date.date() > 22 || date.date() < 17) {
        return alert('※第三輪賽事請選擇17~22號')
      }
      break;
    case 4:
      if(date.date() > 29 || date.date() < 24) {
        return alert('※第四輪賽事請選擇24~29號')
      }
      break;
    default:
      return alert('約戰日期無效')
  }

  if(['9', '10', '11', '15', '16', '17', '19', '20', '21', '22', '23', '0'].indexOf(date.hours().toString()) === -1) {
    return alert('※時段分別為：早【09:00-11:00】、中【15:00-17:00】、晚【19:00-24:00】')
  }

  if(['0'].indexOf(date.minutes().toString()) === -1) {
    return alert('※請選擇整點時段')
  }

  var todayMoment = moment(moment().format('YYYY/MM/DD'), 'YYYY/MM/DD')
  var diffToday = todayMoment.diff(moment(date.format('YYYY/MM/DD'), 'YYYY/MM/DD'), 'days')

  if(diffToday > -1) {
    return alert('※日期請選擇大於今日的時間')
  }

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
  }).done(function(result)  {
    if(result.retMessage === 'game made fail cause triple data in same hour') {
      var startTime =  moment(new Date(data.date)).format('YYYY/MM/DD HH') + ':00'
      var endTime =  moment(new Date(data.date)).add(1, 'hours').format('YYYY/MM/DD HH') + ':00'
      alert('此約戰時間' + startTime + '~' + endTime + '已有三組以上約戰賽事, 請選擇其他時段')
    }

    console.log(result)
    window.location.reload();
  }).fail(function(xhr, textStatus, error)  {
    console.log(xhr, error)
  });
})