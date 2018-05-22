$(document).ready(function(){
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

  let message = getParameterByName('message');
  if (message !== undefined && message !== null) {
    alert(message);
  }

  if (Cookies.get("member_token") !== undefined){
    console.log(Cookies.get('member_id'), '   go')
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/account/' + Cookies.get('member_id')
    }).done((data) => {
      putInData(data)
      //window.location.replace('account-interface-after.html');
    }).fail((data) =>{
      $.unblockUI()
    });
  } else {
    $.unblockUI()
    $('#openModal').css({ 'display': 'block' });
    setTimeout(function() {
        $('#openModal').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 500);
  }
});

function putInData(data) {
  if (data.retCode === 0 && data.result) {
    $('.for-display').css('display', 'block');
    $('.for-input').css('display', 'none');

    // 編輯 送出按鈕
    $('.btn_edit').css("display", "block");
    $('.btn_send').css("display", "none");

    // form的type
    $('#form-type').val('edit');

    // 標籤給值
    $('#team_name_label').html(data.result.team_name);
    $('#account_name_label').html(data.result.account_name);
    $('#account_bank_label').html(data.result.account_bank);
    $('#account_branch_label').html(data.result.account_branch);
    $('#account_num_label').html(data.result.account_num);
    var date = new Date(data.result.transfer_date)
    $('#transfer_date_label').html(date.toLocaleDateString());
    // 輸入框給值
    $('#team_name_input').val(data.result.team_name);
    $('#account_name_input').val(data.result.account_name);
    $('#account_bank_input').val(data.result.account_bank);
    $('#account_branch_input').val(data.result.account_branch);
    $('#account_num_input').val(data.result.account_num);
    $('#transfer_date_input').val(date.toLocaleDateString());
  }

  $.unblockUI()
}

$("#account-form").submit(function (e) {
  e.preventDefault();

  var member_id = Cookies.get('member_id')
  var ajaxType = ''
  var ajaxUrl = ''
  var data = {}

  var formType = $('#form-type').val();
  var team_name = $('#team_name_input').val();
  var account_name = $('#account_name_input').val();
  var account_bank = $('#account_bank_input').val();
  var account_branch = $('#account_branch_input').val();
  var account_num = $('#account_num_input').val();
  var transfer_date = $('#transfer_date_input').val();

  if(formType === 'edit') {
    ajaxType = 'PUT'
    ajaxUrl = '/api/v3/egame/2018-01/account/' + member_id

    data = {
      team_name: team_name,
      account_name: account_name,
      account_bank: account_bank,
      account_branch: account_branch,
      account_num: account_num,
      transfer_date: transfer_date
    }
  }

  if(formType === 'create') {
    ajaxType = 'POST'
    ajaxUrl = '/api/v3/egame/2018-01/account'

    data = {
      member_id: member_id,
      team_name: team_name,
      account_name: account_name,
      account_bank: account_bank,
      account_branch: account_branch,
      account_num: account_num,
      transfer_date: transfer_date
    }
  }


  // var member_id = Cookies.get('member_id')
  // var team_name = $('#team_name_input').val();
  // var account_name = $('#account_name_input').val();
  // var account_bank = $('#account_bank_input').val();
  // var account_branch = $('#account_branch_input').val();
  // var account_num = $('#account_num_input').val();
  // var transfer_date = $('#transfer_date_input').val();
  // var data = {
  //   team_name: team_name,
  //   account_name: account_name,
  //   account_bank: account_bank,
  //   account_branch: account_branch,
  //   account_num: account_num,
  //   transfer_date: transfer_date
  // }

  // $.ajax({
  //   type: 'PUT',
  //   headers: {
  //     "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
  //   },
  //   dataType: 'json',
  //   data: data,
  //   url: 'http://localhost/api/v3/egame/2018-01/account/' + member_id
  // ___

  $.ajax({
    type: ajaxType,
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + ajaxUrl
  }).done((data) => {
    window.location.replace('remittance.html');
  }).fail((xhr, textStatus, error) => {
    alert('新增錯誤')
    console.log(error, textStatus, error);
  });

})

$(document).on('click', '.btn_edit', async function(e) {
  // 編輯 送出按鈕
  $('.btn_edit').css("display", "none");
  $('.btn_send').css("display", "block");

  // 輸入框
  $('.for-input').css("display", "inline");
  $('.for-display').css("display", "none");
})


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
    window.location.replace('remittance.html');
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