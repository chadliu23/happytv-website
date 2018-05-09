
$(document).ready(function(){
  $('#edit-button').on('click', (event) => {
    $('.for-display').css('display', 'none');
    $('.for-input').css('display', 'inline');
  })

  if (Cookies.get("member_token") !== undefined){
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: happyApiHost + '/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
      }).done((data) => {
        if (data.result.length >0){
          $('#team-name-label').val(data.result[0].team_name);
          $('#team-name-input').val(data.result[0].team_name);
          $('#team_id').val(data.result[0].team_id);
        }
        for (var i = data.result.length - 1; i >= 0; i--) {
          let member = data.result[i];
          $('#row_id_' + member.member_role).val(member.row_id);
          $('#summoner_label_' + member.member_role).val(member.summoner);
          $('#summoner_input_' + member.member_role).val(member.summoner);
          $('#member_name_label_' + member.member_role).val(member.member_name);
          $('#member_name_input_' + member.member_role).val(member.member_name);
          $('#school_name_label_' + member.member_role).val(member.school_name);
          $('#school_name_input_' + member.member_role).val(member.school_name);
          $('#student_id_label_' + member.member_role).val(member.student_id);
          $('#student_id_input_' + member.member_role).val(member.student_id);
          $('#phone_label_' + member.member_role).val(member.phone);
          $('#phone_input_' + member.member_role).val(member.phone);
          $('#email_label_' + member.member_role).val(member.email);
          $('#email_input_' + member.member_role).val(member.email);
          if (member.member_id !== null){
            $('#email_verify_success_' + member.member_role).css('display', '');
          }else{
            $('#email_unverify_' + member.member_role).css('display', '');
            $('#email_verify_again_' + member.member_role).css('display', '');
          }
          if(member.id_front_photo !== ''){
            $('#id_front_photo_label_'+ member.member_role).attr('src', member.id_front_photo);
          }
          if(member.id_back_photo !== ''){
            $('#id_back_photo_label_'+ member.member_role).attr('src', member.id_back_photo);
          }
        }
        let message = getParameterByName('message');

        if (message !==undefined && message !== null){
          alert(message);
        }
      }).fail((data) =>{
        window.location.replace('register-interface-before.html');
      });

  }else{
    $('#openModal').css({ 'display': 'block' });
        setTimeout(function() {
            $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
        }, 500);
  }
});

$(document).on('click', '.email-verify-again', function(e) {
  var email = $(this).parent().siblings('td').children('input.email-label').val()

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


// 使用jquery直接抓取資料
$(document).on('click', '#update-egame-btn', async function(e) {
  var member_id = Cookies.get('member_id');
  var team_id = $('#team_id').val();
  var team_name = $('#team-name-input').val();
  var data = {
    member_id: member_id,
    team_id: team_id,
    team_name: team_name
  };

  for(var i=0; i<=6; i++) {
    data['row_id_' + i] = $("[name='row_id_" + i + "']").val();
    data['summoner_' + i] = $("[name='summoner_" + i + "']").val();
    data['name_' + i] = $("[name='name_" + i + "']").val();
    data['school_name_' + i] = $("[name='school_name_" + i + "']").val();
    data['student_id_' + i] = $("[name='student_id_" + i + "']").val();
    data['phone_' + i] = $("[name='phone_" + i + "']").val();
    data['email_' + i] = $("[name='email_" + i + "']").val();
    data['id_front_photo_' + i] = $("[name='id_front_photo_" + i + "']")[0].files[0]
    data['id_back_photo_' + i] = $("[name='id_back_photo_" + i + "']")[0].files[0]
  }

  var form_data = new FormData();
  for ( var key in data ) {
      form_data.append(key, data[key]);
  }

  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: form_data,
    processData: false,  // tell jQuery not to process the data
    contentType: false,   // tell jQuery not to set contentType
    url: happyApiHost + '/api/v3/egame/2018-01/update'
  }).done((data) => {
    window.location.replace('register-interface-after.html?message=修改成功!');
  }).fail((xhr, textStatus, error) => {
    alert('修改錯誤')
    console.log('error')
    console.log(error, textStatus, error);
  });
})

// // 使用form來做ajax
// $("#update-form").submit(function (e) {
//   e.preventDefault();

//   var member_id = Cookies.get('member_id');
//   var form = $(this)[0];
//   var formData = new FormData(form);

//   formData.append('member_id', member_id)

//   $.ajax({
//     type: 'POST',
//     headers: {
//       "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
//     },
//     //dataType: 'json',
//     data: formData,
//     processData: false,  // tell jQuery not to process the data
//     contentType: false,   // tell jQuery not to set contentType
//     url: happyApiHost + '/api/v3/egame/2018-01/update'
//   }).done((data) => {
//     window.location.replace('register-interface-after.html?message=修改成功!');
//   }).fail((xhr, textStatus, error) => {
//     console.log('error')
//     console.log(error, textStatus, error);
//   });
// })

