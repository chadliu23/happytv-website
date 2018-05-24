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

$(document).ready(function(){

  if (Cookies.get("member_token") !== undefined) {
    $('#main').css({ 'display': 'block' });
    setLoadingBlock()
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
    }).done((data) => {
      if (data.result.length === 0) {
        $.unblockUI()
        return
      }

      putInData(data)
      // insertData
      //window.location.replace('signup-after.html');
    }).fail((data) => {
      $.unblockUI()
      console.log('失敗')
    });
  } else {
    var a = $('#openModal')
    $('#openModal').css({ 'display': 'block' });
    $(document).keyup(function(e) {
      if ($('#openModal').is(':visible') &&  e.keyCode === 27) {
        window.location.href= '/egames/way.html#main';
      }
    })

    setTimeout(function() {
        $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
})


function putInData(data) {
  if (data.result.length === 0){
    $.unblockUI()
    return
  }

  // 編輯 送出按鈕
  $('.btn_edit').css("display", "block");
  $('.btn_send').css("display", "none");

  // form的type
  $('#form-type').val('edit');

  // 輸入框
  $('.for-input').css("display", "none");
  $('.for-display:not(.about-verify)').css("display", "inline");

  if (data.result.length >0){
    $('#team-name-label').html(data.result[0].team_name);
    $('#team-name-input').val(data.result[0].team_name);
    $('#team_id').val(data.result[0].team_id);
  }
  for (var i = 0; i < data.result.length; i++) {
    let member = data.result[i];
    $('#row_id_' + member.member_role).val(member.row_id);
    $('#summoner_label_' + member.member_role).html(member.summoner);
    $('#summoner_input_' + member.member_role).val(member.summoner);
    $('#member_name_label_' + member.member_role).html(member.member_name);
    $('#member_name_input_' + member.member_role).val(member.member_name);
    $('#school_name_label_' + member.member_role).html(member.school_name);
    $('#school_name_input_' + member.member_role).val(member.school_name);
    $('#student_id_label_' + member.member_role).html(member.student_id);
    $('#student_id_input_' + member.member_role).val(member.student_id);
    $('#phone_label_' + member.member_role).html(member.phone);
    $('#phone_input_' + member.member_role).val(member.phone);
    $('#email_label_' + member.member_role).html(member.email);
    $('#email_input_' + member.member_role).val(member.email);

    if (member.member_id !== null){
      $('#email_verify_success_' + member.member_role).css('display', '');
      $('#member_id_' + member.member_role).html(member.member_id);
    }else{
      $('#email_unverify_' + member.member_role).css('display', '');
      $('#email_verify_again_' + member.member_role).css('display', '');
    }
    // if (member.member_id !== null){
    //   $('#email_verify_success_' + member.member_role).css('display', '');
    // }else{
    //   $('#email_unverify_' + member.member_role).css('display', '');
    //   $('#email_verify_again_' + member.member_role).css('display', '');
    // }
    // if(member.id_front_photo !== ''){
    //   $('#id_front_photo_label_'+ member.member_role).attr('src', member.id_front_photo);
    // }
    // if(member.id_back_photo !== ''){
    //   $('#id_back_photo_label_'+ member.member_role).attr('src', member.id_back_photo);
    // }
  }

  set5InputRequired()
  set6InputRequired()

  // 解除
  $.unblockUI()
};

$(document).on('click', '.btn_edit', async function(e) {
  // 編輯 送出按鈕
  $('.btn_edit').css("display", "none");
  $('.btn_send').css("display", "block");

  // 輸入框
  // $('.for-input').css("display", "inline");
  // $('.for-display').css("display", "none");

  // 為了不讓已經驗證過的修改
  for(var i=0; i<=6; i++) {
    if($('#member_id_' + i).html()) {
    } else {
      $('#summoner_label_' + i).css("display", "none");
      $('#member_name_label_' + i).css("display", "none");
      $('#school_name_label_' + i).css("display", "none");
      $('#student_id_label_' + i).css("display", "none");
      $('#phone_label_' + i).css("display", "none");
      $('#email_label_' + i).css("display", "none");

      $('#summoner_input_' + i).css("display", "inline");
      $('#summoner_input_' + i).parent('li').css("display", "inline");
      $('#member_name_input_' + i).css("display", "inline");
      $('#member_name_input_' + i).parent('li').css("display", "inline");
      $('#school_name_input_' + i).css("display", "inline");
      $('#school_name_input_' + i).parent('li').css("display", "inline");
      $('#student_id_input_' + i).css("display", "inline");
      $('#student_id_input_' + i).parent('li').css("display", "inline");
      $('#phone_input_' + i).css("display", "inline");
      $('#phone_input_' + i).parent('li').css("display", "inline");
      $('#email_input_' + i).css("display", "inline");
      $('#email_input_' + i).parent('li').css("display", "inline");
    }
  }

})

// // 使用form來做ajax
$("#sign-up-form").submit(function (e) {
  e.preventDefault();

  // var member_id = Cookies.get('member_id');
  // var form = $(this)[0];
  // var formData = new FormData(form);

  // formData.append('member_id', member_id)

  // console.log('formdata:' , formData)

  var member_id = Cookies.get('member_id');
  var team_id = $('#team_id').val();
  var team_name = $('#team-name-input').val();
  var formType = $('#form-type').val();
  var data = {};
  var ajaxType = 'POST';
  var ajaxUrl = ''
  var successMsg = ''

  if(formType === 'edit') {
    data.member_id = member_id;
    data.team_id = team_id;
    data.team_name = team_name;
    ajaxUrl = '/api/v3/egame/2018-01/update'
    successMsg = '修改成功!'

    for(var i=0; i<=6; i++) {
      if (i === 5) {
        var hasValue = $('.member-5-input').attr("required")
        if(!hasValue) {
          continue;
        }
      }

      if (i === 6) {
        var hasValue = $('.member-6-input').attr("required")
        if(!hasValue) {
          continue;
        }
      }

      data['row_id_' + i] = $("[name='row_id_" + i + "']").val();
      data['summoner_' + i] = $("[name='summoner_" + i + "']").val();
      data['name_' + i] = $("[name='name_" + i + "']").val();
      data['school_name_' + i] = $("[name='school_name_" + i + "']").val();
      data['student_id_' + i] = $("[name='student_id_" + i + "']").val();
      data['phone_' + i] = $("[name='phone_" + i + "']").val();
      data['email_' + i] = $("[name='email_" + i + "']").val();
      // data['id_front_photo_' + i] = $("[name='id_front_photo_" + i + "']")[0].files[0]
      // data['id_back_photo_' + i] = $("[name='id_back_photo_" + i + "']")[0].files[0]
    }
  }

  if(formType === 'create') {
    data.member_id = member_id;
    data.team_name = team_name;
    ajaxUrl = '/api/v3/egame/2018-01/create'
    successMsg = '您已成功登錄隊伍，請儘速完成下列事項：\rA、通知隊員進行Email認證\rB、上傳全隊學生證明文件\rC、3日內繳交保證金並回報'

    for(var i=0; i<=6; i++) {
      data['summoner_' + i] = $("[name='summoner_" + i + "']").val();
      data['name_' + i] = $("[name='name_" + i + "']").val();
      data['school_name_' + i] = $("[name='school_name_" + i + "']").val();
      data['student_id_' + i] = $("[name='student_id_" + i + "']").val();
      data['phone_' + i] = $("[name='phone_" + i + "']").val();
      data['email_' + i] = $("[name='email_" + i + "']").val();
      // data['id_front_photo_' + i] = $("[name='id_front_photo_" + i + "']")[0].files[0]
      // data['id_back_photo_' + i] = $("[name='id_back_photo_" + i + "']")[0].files[0]
    }
  }

  var summonerHasDup = false;
  var schoolAndIdHasDup = false;
  var emailHasDup = false;
  for(var i=0; i<=6; i++) {
    if(data['summoner_' + i] === null || data['summoner_' + i] === '') {
      continue;
    }
    if(data['school_name_' + i] === null || data['school_name_' + i] === '') {
      continue;
    }
    if(data['student_id_' + i] === null || data['student_id_' + i] === '') {
      continue;
    }
    if(data['email_' + i] === null || data['email_' + i] === '') {
      continue;
    }

    for(var j=0; j<=6; j++) {
      if(i === j) {continue}
      if (data['summoner_' + i] === data['summoner_' + j]) {
        summonerHasDup = true
      }
      if (data['school_name_' + i] + data['student_id_' + i] === data['school_name_' + j] + data['student_id_' + j]) {
        schoolAndIdHasDup = true
      }
      if (data['email_' + i] === data['email_' + j]) {
        emailHasDup = true
      }
    }
  }

  if(summonerHasDup) { return alert('召喚師資料重複, 請檢查資料是否正確') }
  if(schoolAndIdHasDup) { return alert('同學校的學號資料重複, 請檢查資料是否正確') }
  if(emailHasDup) { return alert('信箱資料重複, 請檢查資料是否正確') }

  var formData = new FormData();
  for ( var key in data ) {
      formData.append(key, data[key]);
  }

  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    //dataType: 'json',
    data: formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    url: happyApiHost + ajaxUrl
  }).done((data) => {
    if(data.retCode === 0 && data.retMessage === "duplicate data summoner") {
      return alert('隊伍中已有被登錄過的召喚師名稱，請重新核對隊員資料後再行登錄')
    }

    if(data.retCode === 0 && data.retMessage === "duplicate data email") {
      return alert('隊伍中已有被登錄過的email，請重新核對隊員資料後再行登錄')
    }

    if(data.retCode === 0 && data.retMessage === "duplicate data schoolAndId") {
      return alert('隊伍中已有被登錄過的同學校同學號參賽者，請重新核對隊員資料後再行登錄')
    }

    if(data.retCode === 0 && data.retMessage === "send email error") {
      alert('資料中有不正確的信箱，請修正後盡快修改重新驗證')
      return window.location.replace('signup.html');
    }

    alert(successMsg)
    window.location.replace('signup.html');
  }).fail((xhr, textStatus, error) => {
    alert('錯誤, 若報名仍不成功, 請加入官方Line @JDH4282L 告知')
    // window.location.replace('signup.html');
    console.log('error')
    console.log(error, textStatus, error);
  });
})


$(document).on('change', '.member-5-input', async function(e) {
  set5InputRequired()
})

$(document).on('change', '.member-6-input', async function(e) {
  set6InputRequired()
})

function set5InputRequired() {
  var member5Inputs = $('.member-5-input')
  var allStr = ""

  member5Inputs.each(function(key, member5Input){
    allStr = allStr + $(member5Input).val()
  })

  if(allStr.trim() === "") {
    $('.member-5-input').removeAttr("required")
  } else {
    $('.member-5-input').attr("required", "required")
  }
}

function set6InputRequired() {
  var member6Inputs = $('.member-6-input')
  var allStr = ""

  member6Inputs.each(function(key, member6Input){
    allStr = allStr + $(member6Input).val()
  })

  if(allStr.trim() === "") {
    $('.member-6-input').removeAttr("required")
  } else {
    $('.member-6-input').attr("required", "required")
  }
}

$(document).on('click', '.btn_resend', function(e) {
  var email = $(this).parent().siblings('li.email-label').html()

  if(email === undefined || email === null || email === '') {
    alert('無email資料')
    return
  }

  $.ajax({
    type: 'PUT',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    url: happyApiHost + '/api/v3/egame/2018-01/resend/email/' + email
  }).done((data) => {
    alert('發送成功!')
    //window.location.replace('register-interface-after.html?message=修改成功!');
  }).fail((xhr, textStatus, error) => {
    alert('發送錯誤')
    console.log('error')
    console.log(error, textStatus, error);
  });
})

$(document).on('click', '#create-egame-btn', async function(e) {
  return
  var member_id = Cookies.get('member_id');
  var team_name = $('#team_name').val();
  var data = {
    member_id: member_id,
    team_name: team_name
  };

  for(var i=0; i<=6; i++) {
    data['summoner_' + i] = $("[name='summoner_" + i + "']").val();
    data['name_' + i] = $("[name='name_" + i + "']").val();
    data['school_name_' + i] = $("[name='school_name_" + i + "']").val();
    data['student_id_' + i] = $("[name='student_id_" + i + "']").val();
    data['phone_' + i] = $("[name='phone_" + i + "']").val();
    data['email_' + i] = $("[name='email_" + i + "']").val();
  }

  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + '/api/v3/egame/2018-01/create'
  }).done((data) => {
    window.location.replace('register-interface-after.html?message=成功登記隊伍!請記得EMAIL認證');
  }).fail((xhr, textStatus, error) => {
    alert('修改錯誤')
    console.log(error, textStatus, error);
  });
})
