var team_id = ''
var team_name = ''

$(document).ready(function(){
  if (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) {
    alert('請使用電腦版網站報名')
    history.go(-1)　
  }

  $("transfer_date_input").on("change", function() {
    this.setAttribute(
        "data-date",
        moment(this.value, "YYYY-MM-DD")
        .format( this.getAttribute("data-date-format") )
    )
  }).trigger("change");

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
    $('#main').css({ 'display': 'block' });
    return loadTeamId()

    function loadTeamId () {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: happyApiHost + '/api/v3/egame/2018-01/member_id/' + Cookies.get('member_id')
      }).done(function(data)  {
        if (data.result.length === 0) {
          alert('請先報名戰隊')
          window.location.replace('signup.html#main');
          return
        }

        // 抓team_id
        team_id = data.result[0].team_id;
        team_name = data.result[0].team_name;
        $('#team_name_label').css("display", "block");
        $('#team_name_label').html(team_name);

        return loadAccount()
      }).fail(function(data)  {
        alert('請先報名戰隊')
        window.location.replace('signup.html#main');
        return
      });

    }

    function loadAccount() {
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: happyApiHost + '/api/v3/egame/2018-01/account/' + team_id
      }).done(function(data)  {
        putInData(data)
        //window.location.replace('account-interface-after.html');
      }).fail(function(data) {
        $.unblockUI()
      });
    }
  } else {
    $.unblockUI()
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
    $('#account_name_label').html(data.result.account_name);
    $('#account_bank_label').html(data.result.account_bank);
    $('#account_branch_label').html(data.result.account_branch);
    $('#account_num_label').html(data.result.account_num);
    var date = new Date(data.result.transfer_date)
    $('#transfer_date_label').html(date.toLocaleDateString());
    // 輸入框給值
    $('#team_name_input').val(team_name);
    $('#account_name_input').val(data.result.account_name);
    $('#account_bank_input').val(data.result.account_bank);
    $('#account_branch_input').val(data.result.account_branch);
    $('#account_num_input').val(data.result.account_num);
    $('#transfer_date_input').val( moment(date).format( 'YYYY-MM-DD') );
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
  // var team_name = team_name;
  var account_name = $('#account_name_input').val();
  var account_bank = $('#account_bank_input').val();
  var account_branch = $('#account_branch_input').val();
  var account_num = $('#account_num_input').val();
  var transfer_date = $('#transfer_date_input').val();

  if(formType === 'edit') {
    ajaxType = 'PUT'
    ajaxUrl = '/api/v3/egame/2018-01/account/' + team_id

    data = {
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
      team_id: team_id,
      team_name: team_name,
      account_name: account_name,
      account_bank: account_bank,
      account_branch: account_branch,
      account_num: account_num,
      transfer_date: transfer_date
    }
  }

  $.ajax({
    type: ajaxType,
    headers: {
      "accesskey": "accessKey_eb3604bd21a3176806f29607d47b069f17956cba",
    },
    dataType: 'json',
    data: data,
    url: happyApiHost + ajaxUrl
  }).done(function(data)  {
    window.location.replace('remittance.html');
  }).fail(function(xhr, textStatus, error) {
    alert('匯款帳號修改錯誤')
    console.log(error, textStatus, error);
  });

})

$(document).on('click', '.btn_edit',  function(e) {
  // 編輯 送出按鈕
  $('.btn_edit').css("display", "none");
  $('.btn_send').css("display", "block");

  // 輸入框
  $('.for-input').css("display", "inline");
  $('.for-display').css("display", "none");
  $('#team_name_label').css("display", "block");
})


$(document).on('click', '#create_account_btn',  function(e) {
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
  }).done(function(data)  {
    window.location.replace('remittance.html');
  }).fail(function(xhr, textStatus, error)  {
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