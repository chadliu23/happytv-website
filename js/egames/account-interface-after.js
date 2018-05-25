
$(document).ready(function(){
  $('#edit-button').on('click', function(event)  {
    $('.for-display').css('display', 'none');
    $('.for-input').css('display', 'inline');
  })

  if (Cookies.get("member_token") !== undefined){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/account/' + Cookies.get('member_id')
    }).done(function(data)  {
      if (data.retCode === 0 && data.result) {
        // 標籤給值
        $('#team_name_lable').val(data.result.team_name);
        $('#account_name_lable').val(data.result.account_name);
        $('#account_bank_lable').val(data.result.account_bank);
        $('#account_branch_lable').val(data.result.account_branch);
        $('#account_num_lable').val(data.result.account_num);
        var date = new Date(data.result.transfer_date)
        $('#transfer_date_lable').val(date.toLocaleDateString());
        // 輸入框給值
        $('#team_name_input').val(data.result.team_name);
        $('#account_name_input').val(data.result.account_name);
        $('#account_bank_input').val(data.result.account_bank);
        $('#account_branch_input').val(data.result.account_branch);
        $('#account_num_input').val(data.result.account_num);
        $('#transfer_date_input').val(date.toLocaleDateString());
      }

      let message = getParameterByName('message');

      if (message !== undefined && message !== null) {
        alert(message);
      }
    }).fail(function(data) {
      window.location.replace('register-interface-before.html');
    });
  } else {
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
        $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
});


$(document).on('click', '#update-account-btn',  function(e) {
  var member_id = Cookies.get('member_id')
  var team_name = $('#team_name_input').val();
  var account_name = $('#account_name_input').val();
  var account_bank = $('#account_bank_input').val();
  var account_branch = $('#account_branch_input').val();
  var account_num = $('#account_num_input').val();
  var transfer_date = $('#transfer_date_input').val();
  var data = {
    team_name: team_name,
    account_name: account_name,
    account_bank: account_bank,
    account_branch: account_branch,
    account_num: account_num,
    transfer_date: transfer_date
  }

  $.ajax({
    type: 'PUT',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: 'http://localhost/api/v3/egame/2018-01/account/' + member_id
  }).done(function(data)  {
    console.log(data)
    window.location.replace('account-interface-after.html');
  }).fail(function(xhr, textStatus, error)  {
    alert('修改錯誤')
    console.log(error, textStatus, error);
  });
})
