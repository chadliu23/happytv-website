function showProgramsInChannel(attr) {
  id = attr.split("#")[1];
  $('.tab-pane').hide();
  $('#' + id).show();

}
  function list(index, image, link) {
    $.ajax({
      type: 'GET',
      headers: {
        'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
      },
      url: "https://api-product.happytv.com.tw/api/v3/epg/channelNumber/"+link
    }).done((data) => {
      let today = new Date();
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const date1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
      const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 0, 0, 0);
      let dateMap = {};
      dateMap[Date.parse(date)] = '#today' + index + '';
      dateMap[Date.parse(date1)] = '#secondDay' + index + '';
      dateMap[Date.parse(date2)] = '#thirdDay' + index + '';
      let dateBSMap = {};
      dateBSMap[Date.parse(date)] = '#BStoday' + index + '';
      dateBSMap[Date.parse(date1)] = '#BSsecond' + index + '';
      dateBSMap[Date.parse(date2)] = '#BSthird' + index + '';

      for (let i = 1; i < data.result.program.length - 1; i++) {
        let channel = data.result.program[i];
        let startDate = data.result.program[i].startTime;
        let endDate = data.result.program[i].endTime;
        $(dateMap[Date.parse(data.result.program[i].date)]).text(data.result.program[i].date);
        $(dateBSMap[Date.parse(data.result.program[i].date)]).append('<div class="col-md-12 col-sm-12 col-xs-12">' +
          '<div class="panel panel-t col-md-12 col-sm-12 col-xs-12">' +
          '<div class="panel-timetable col-md-4 col-sm-6 col-xs-6">' +
          '<img class="img-responsive" src=' + image + '>' +
          '</div>' +
          '<div class="panel-tbody col-md-8 col-sm-6 col-xs-6">' +
          '<p class="text-t"><i class="fa " aria-hidden="true"></i>' + startDate + " ~ " + endDate + '</p>' +
          '<h5 class="media-t">' + channel.name + '</h5>' +
          '<p class="text-t">' + channel.remark + '</p>' +
          '</div>' +
          '</div>');
      }
    }).fail((data) => {
      console.log('error');
    });
  }
  list(0, 'images/tvicon/lwm.png', 'MOD611');
  list(1, 'images/tvicon/lta.jpg', 'MOD104');
