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
    url: "https://api-product.happytv.com.tw/api/v3/epg/channel/" + link
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
          '<p class="text-t"><i class="fa " aria-hidden="true"></i>' + startDate + ":" + endDate +  '</p>' +
          '<h5 class="media-t">'  + channel.name + '</h5>' +
          '<p class="text-t">' + channel.remark + '</p>' +
          '</div>' +
          '</div>');
      }
  }).fail((data) => {
    console.log('error');
  });
}
list(0, 'images/tvicon/psg1-1.png', 'c1557208f91fd098c2bd8e786f73a9c39f08d1dd');
list(1, 'images/tvicon/psg2-1.png', 'dbb1891937464468918b02f9259a900312d6e01c');
list(2, 'images/tvicon/pst2.png', '6f78e3a2cd845be6da276265894a68ad6b27d6e8');
list(3, 'images/tvicon/ps2.png', '008748a8b1b24092e4bb4d6a41f3a6533b19c9a0');
list(4, 'images/tvicon/psc2.png', '27c60fc1183f96bb813ca26879b160cb9bec0c99');
list(5, 'images/tvicon/psft2.png', '60539ceb94cf929fc392f4319adb880b0d203e16');
list(6, 'images/tvicon/psi2.png', '870d7e82ca38073824843a0d029afa5e346427ed');
