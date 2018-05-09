
$(document).ready(function(){
  if (Cookies.get("member_token") !== undefined){
    console.log(Cookies.get('member_id'), '   go')
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/account/' + Cookies.get('member_id')
    }).done((data) => {
      window.location.replace('account-interface-after.html');
    }).fail((data) =>{

    });
  } else {
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
        $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
});

$(document).on('click', '#create_account_btn', async function(e) {
  var member_id = Cookies.get('member_id')
  var team_name = $('#team_name').val();
  var account_name = $('#account_name').val();
  var account_bank = $('#account_bank').val();
  var account_branch = $('#account_branch').val();
  var account_num = $('#account_num').val();
  var transfer_date = $('#transfer_date').val();

  var data = {
    member_id: member_id,
    team_name: team_name,
    account_name: account_name,
    account_bank: account_bank,
    account_branch: account_branch,
    account_num: account_num,
    transfer_date: transfer_date
  }
  // accessKey_k46zs4fyf4rbajev6px4384uztxhd3hrtdmu2btgzubtrpz9cpsnrnfqfhruyshp
  $.ajax({
    type: 'POST',
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + '/api/v3/egame/2018-01/account'
  }).done((data) => {
    console.log(data)
    window.location.replace('account-interface-after.html');
  }).fail((xhr, textStatus, error) => {
    alert('新增錯誤')
    console.log(error, textStatus, error);
  });
})

function createAccount () {
  var teamName = $('#team_name').val();
  var account_name = $('#account_name').val();
  var account_bank = $('#account_bank').val();
  var account_branch = $('#account_branch').val();
  var account_num = $('#account_num').val();
  var transfer_date = $('#transfer_date').val();
}