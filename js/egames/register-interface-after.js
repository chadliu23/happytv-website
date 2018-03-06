
$(document).ready(function(){
  $('#edit-button').on('click', (event) => {
    $('.for-display').css('display', 'none');
    $('.for-input').css('display', 'inline');
  })

  if (Cookies.get("member_token") !== undefined){
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://api-product.happytv.com.tw/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
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
