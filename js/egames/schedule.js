$(document).ready(function(){
  if (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) {
    alert('請使用電腦版網站觀看賽程表')
  }

  $('td.up-load').css('display', 'table-cell')
  //alert(css)
  setLoadingBlock()

  return initPage()
});

function initPage() {
  // 載入賽區資料
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: happyApiHost + '/api/v3/egame/2018-01/gameGroup'
  }).done((data) => {
    if (data && data.result) {
      data.result.forEach((group) => {
        //var liHtml = '<li><a href="#main">' + group.group + '區</a></li>'
        var liHtml = '<li><a id="group-tab-' + group.group + '" href="/egames/process-before.html#main?group=' + group.group + '"><span>' + group.group + '區</span></a></li>'
        //liHtml = $(liHtml).attr("onclick", "loadScheduleByGroup('" + group.group + "')")
        liHtml = $(liHtml).attr("onclick", "window.location.reload();")
        $('.process_tab').append(liHtml)
      })
    }

    let group = getParameterByName('group');

    $('#group-tab-' + group).attr('style', 'color: orange; ')
    $('#group-tab-' + group).attr('style', 'opacity: 1; ')
    //$('#group-tab-' + group).attr('class', 'active-tab')
    if (group !== undefined && group !== null) {
      loadScheduleByGroup(group);
    }

    $.unblockUI()
  }).fail((jqXHR, textStatus ) => {
    $.unblockUI()
    alert('資料讀取失敗', jqXHR, textStatus)
  });
}

$(document).on('change', 'input[name="result_photo"]',  function(e) {
  var isValid = ValidateSingleInput(this)
  if(!isValid) {
    $.unblockUI()
    return
  }

  var data = {};
  var ajaxType = 'POST';
  var rowId = $(this).next('input[name="row_id"]').val()
  var ajaxUrl = '/api/v3/egame/2018-01/gameSchedule/resultPhoto/' + rowId
  var successMsg = '上傳成功!'
  var file = $(this).prop('files')[0];
  data.result_photo = file;

  var formData = new FormData();
  for ( var key in data ) {
    formData.append(key, data[key]);
  }

  return $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    //dataType: 'json',
    data: formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    url: happyApiHost + ajaxUrl
  }).done(function(data) {
    $.unblockUI()
    alert(successMsg)
    window.location.reload();
  }).fail(function(xhr, textStatus, error)  {
    $.unblockUI()
    alert('上傳有誤, 請檢查是否已看到對戰結果上傳\r並且每張圖片上傳檔案需小於3MB')
    console.log('error')
    console.log(error, textStatus, error);
  });
})

function ValidateSingleInput(oInput) {
  var _validFileExtensions = [".jpg", ".png"];
  var sFileName = oInput.value;
  if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
          var sCurExtension = _validFileExtensions[j];
          if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
              blnValid = true;
              break;
          }
      }

      if (!blnValid) {
          alert("請選擇" + _validFileExtensions.join("或")+ "的圖片");
          oInput.value = "";
          return false;
      }
      let filekb =  (Math.round(oInput.files[0].size/ 1024 *100) /100);
      if (filekb > (3*1024)) {
        alert("單張照片限制3MB");
        oInput.value = "";

        return false;
      }

  }

  return true;
}

function loadScheduleByGroup(group) {
  $('#schedule-title').html('賽程表 - ' + group + "區")

  setLoadingBlock()

  var data = {
    group: group
  }

  return getUserTeamId(function(team_id) {
    $.ajax({
      type: 'GET',
      data: data,
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/gameSchedule/' + group
    }).done((data) => {
      if (data && data.result) {
        data.result.forEach((schedule) => {
          console.log(schedule)
          var scheduleTd = $('td.game_process_' + schedule.game_progress  + '.process_order_' + schedule.progress_order)
          scheduleTd.children('input.team-button.blue').val(schedule.blue_name)
          scheduleTd.children('input.team-button.purple').val(schedule.red_name)
          scheduleTd.children('input.team-button.blue').attr('title', schedule.blue_name)
          scheduleTd.children('input.team-button.purple').attr('title', schedule.red_name)
          if(schedule.winner === schedule.blue_id) {
            scheduleTd.children('input.team-button.purple').addClass('lose')
            scheduleTd.children('input.team-button.purple').val(schedule.red_name + '  (敗)')
            scheduleTd.children('input.team-button.blue').val(schedule.blue_name + '  (勝)')
          }
          if(schedule.winner === schedule.red_id) {
            scheduleTd.children('input.team-button.blue').addClass('lose')
            scheduleTd.children('input.team-button.blue').val(schedule.blue_name + '  (敗)')
            scheduleTd.children('input.team-button.purple').val(schedule.red_name + '  (勝)')
          }

          // 再加入只留一個上傳
          if(team_id === schedule.blue_id || team_id === schedule.red_id) {
            scheduleTd.prev('.up-load').removeClass('none')
            scheduleTd.prev('.up-load').children('.up-load-result-img').css('display', 'inline-block')
            scheduleTd.prev('.up-load').children('.up-load-result-img').attr('src', schedule.result_photo)
            //scheduleTd.prev('.up-load').children('.up-load-result-img').attr('src', 'http://localhost/images/egame/result/f1441939c3e629634123f04386d0fe76c9ba70d7.png')
            scheduleTd.prev('.up-load').children('input[type="file"]').css('display', 'inline-block')
            scheduleTd.prev('.up-load').children('input[name="row_id"]').val(schedule.row_id)
          }
        })
      }

      $.unblockUI()
    }).fail((jqXHR, textStatus ) => {
      $.unblockUI()
      alert('資料讀取失敗', jqXHR, textStatus)
    });
  })

  function getUserTeamId(cb) {
    if (Cookies.get("member_token") === undefined) {
      return cb()
    }

    var member_id = Cookies.get('member_id')

    return $.ajax({
      type: 'GET',
      data: data,
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/team_id/' + member_id
    }).done((data) => {
      //alert(JSON.stringify(data))
      if (data && data.result) {
        return cb(data.result)
      }

      return cb()
    }).fail((jqXHR, textStatus ) => {
      return cb()
    });
  }
}

function setLoadingBlock() {
  $.blockUI({
    message: 'loading...',
    css: {
      border: 'none',
      padding: '15px',
      backgroundColor: '#000',
      '-webkit-border-radius': '10px',
      '-moz-border-radius': '10px',
      opacity: .5,
      color: '#fff',
      message: 'Loading...'
    }
  });
}