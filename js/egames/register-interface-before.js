
$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
    }).done((data) => {
     window.location.replace('register-interface-after.html');
    }).fail((data) =>{

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

$(document).on('click', '#create-egame-btn', async function(e) {
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
