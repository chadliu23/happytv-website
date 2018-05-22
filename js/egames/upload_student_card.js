
window.onload=function(){
  let message = getParameterByName('message');
  if (message !== undefined && message !== null) {
    alert(message);
  }

  if (Cookies.get("member_token") !== undefined) {
    console.log(Cookies.get("member_token"))
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
    }).done((data) => {
      if (data.result.length === 0) {
      	alert('請先報名戰隊')
      	window.location.replace('signup?message=' + successMsg);
        return
      }
      putInData(data)
      // insertData
      //window.location.replace('signup-after.html');
    }).fail((data) => {

    });
  } else {
    var a = $('#openModal')
    console.log(a.length)
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
        $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
}


function putInData(data) {
  // $('#edit-button').on('click', (event) => {
  //   $('.for-display').css('display', 'none');
  //   $('.for-input').css('display', 'inline');
  // })

  // // 編輯 送出按鈕
  // $('.btn_edit').css("display", "block");
  // $('.btn_send').css("display", "none");

  // // form的type
  // $('#form-type').val('edit');

  // // 輸入框
  // $('.for-input').css("display", "none");
  // $('.for-display').css("display", "inline");

  if (data.result.length >0){
    $('#team_id').val(data.result[0].team_id);
  }
  console.log('全部的:', data.result)
  for (var i = 0; i < data.result.length; i++) {
    let member = data.result[i];
    $('#row_id_' + member.member_role).val(member.row_id);
    $('.member_' + member.member_role).css('display', 'inline');
    // if (member.member_id !== null){
    //   $('#email_verify_success_' + member.member_role).css('display', '');
    // }else{
    //   $('#email_unverify_' + member.member_role).css('display', '');
    //   $('#email_verify_again_' + member.member_role).css('display', '');
    // }
    if(member.id_front_photo !== ''){
      $('#id_front_photo_label_'+ member.member_role).attr('src', member.id_front_photo);
    }
    if(member.id_back_photo !== ''){
      $('#id_back_photo_label_'+ member.member_role).attr('src', member.id_back_photo);
    }
  }

};



$("#upload-form").submit(function (e) {
  e.preventDefault();

  var member_id = Cookies.get('member_id');
  var team_id = $('#team_id').val();
  // var team_name = $('#team-name-input').val();
  var data = {};
  var ajaxType = 'POST';
  var ajaxUrl = ''
  var successMsg = ''

	data.member_id = member_id;
	 data.team_id = team_id;
	// data.team_name = team_name;
	ajaxUrl = '/api/v3/egame/2018-01/update_photo'
	successMsg = '修改成功!'

	for(var i=0; i<=6; i++) {
		var a = $("[name='row_id_" + i + "']").val();
		console.log('hi:', a)
	  data['row_id_' + i] = $("[name='row_id_" + i + "']").val();
	  // data['summoner_' + i] = $("[name='summoner_" + i + "']").val();
	  // data['name_' + i] = $("[name='name_" + i + "']").val();
	  // data['school_name_' + i] = $("[name='school_name_" + i + "']").val();
	  // data['student_id_' + i] = $("[name='student_id_" + i + "']").val();
	  // data['phone_' + i] = $("[name='phone_" + i + "']").val();
	  // data['email_' + i] = $("[name='email_" + i + "']").val();
	  data['id_front_photo_' + i] = $("[name='id_front_photo_" + i + "']")[0].files[0]
	  data['id_back_photo_' + i] = $("[name='id_back_photo_" + i + "']")[0].files[0]
	}

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
    window.location.replace('upload_student_card.html?message=' + successMsg);
  }).fail((xhr, textStatus, error) => {
    alert('上傳失敗, 每次上傳檔案請小於1MB')
    console.log('error')
    console.log(error, textStatus, error);
  });
})