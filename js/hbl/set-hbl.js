
var recordByDate = {}
$(function() {

  $('#date').on('change', function(){
    var selected = $(this).find("option:selected").val();
    $.ajax({
      type: 'GET',
      headers: {
        'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
      },
      url: "https://api-product.happytv.com.tw/api/v3/hbl/record/date/" + selected
    }).done((data) => {
      recordByDate = data;
      $('#location').empty();
      $('#event_id').empty();
      $('#input-area').css('display', 'none')
      $('#location').append($('<option>', {value:'', text:'-', selected: true, disabled: true}));
      for(let location in recordByDate.result){
        $('#location').append($('<option>', {value:location, text:location.replace(/\d/, '')}));
      }
    }).fail((data) => {
      console.log('error');
    });

  });
  $('#location').on('change', function(){
    var selected = $(this).find("option:selected").val();
    let items = recordByDate.result[selected];
    $('#event_id').empty();
    $('#input-area').css('display', 'none')
    $('#event_id').append($('<option>', {value:'', text:'-', selected: true, disabled: true}));
    for(let i in items){
      $('#event_id').append($('<option>', {value:i, text:items[i].time + ' ' + items[i].home + ' ' + items[i].visitor }));
    }

  });
  $('#event_id').on('change', function(){
    let event_id = $(this).find("option:selected").val();
    let location = $('#location').find("option:selected").val();
    let item = recordByDate.result[location][event_id];
    $('#hbl_id').val(item.id);
    $('#home').val(item.home);
    $('#home_score').val(item.home_score);
    $('#visitor').val(item.visitor);
    $('#visitor_score').val(item.visitor_score);

    $('#input-area').css('display', 'block')

  });
  $('#submit').on('click', function (e) {
    let data = {
      home: $('#home').val(),
      home_score: $('#home_score').val(),
      visitor: $('#visitor').val(),
      visitor_score:$('#visitor_score').val()
    };
    $.ajax({
      type: 'PUT',
      headers: {
        'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
      },
      url: "https://api-product.happytv.com.tw/api/v3/hbl/record/id/" + $('#hbl_id').val(),
      data: data
    }).done((data) => {
       alert('Update Success')
       $('#input-area').css('display', 'none')
    }).fail((data) => {
      alert('Update Fail')
    });

  })
});