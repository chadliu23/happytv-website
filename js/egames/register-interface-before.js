
$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
    }).done(function(data)  {
     window.location.replace('register-interface-after.html');
    }).fail(function(data) {

    });
  }else{
    $('#openModal').css({ 'display': 'block' });
        setTimeout(function() {
            $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }, 500);
  }
});

// $("#create-form").submit(function (e) {
//   return
// })

// // 使用form來做ajax
$("#create-form").submit(function (e) {
  e.preventDefault();
  return
  var member_id = Cookies.get('member_id');
  var form = $(this)[0];
  var formData = new FormData(form);

  formData.append('member_id', member_id)

  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    //dataType: 'json',
    data: formData,
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    url: happyApiHost + '/api/v3/egame/2018-01/update'
  }).done(function(data)  {
    window.location.replace('register-interface-after.html?message=修改成功!');
  }).fail(function(xhr, textStatus, error)  {
    console.log('error')
    console.log(error, textStatus, error);
  });
})


$(document).on('change', '.member-5-input',  function(e) {
  var a = $(this).val()
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
})

$(document).on('change', '.member-6-input',  function(e) {
  var a = $(this).val()
  var member6Inputs = $('.member-6-input')
  var allStr = ""

  member6Inputs.each(function(key, member5Input){
    allStr = allStr + $(member6Input).val()
  })

  if(allStr.trim() === "") {
    $('.member-6-input').removeAttr("required")
  } else {
    $('.member-6-input').attr("required", "required")
  }
})

$(document).on('click', '#create-egame-btn',  function(e) {
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
  }).done(function(data)  {
    window.location.replace('register-interface-after.html?message=成功登記隊伍!請記得EMAIL認證');
  }).fail(function(xhr, textStatus, error) {
    alert('修改錯誤')
    console.log(error, textStatus, error);
  });
})
