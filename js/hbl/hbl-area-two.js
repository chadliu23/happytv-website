function showProgramsInChannel(attr) {
  id = attr.split("#")[1];
  $('.record-table').hide();
  $('#' + id).show();

}
function showGame( items, index){
  let element = '';
  element += '<td>' + items[index].event_id + '</td>';
  element += '<td>' + items[index].time ;
  if (items[index].sex === 1){
    element += '<div class="girl">(女)</div>';
  }
  element += '</td>';

  let visitorWin = false;
  if (items[index].visitor_score > items[index].home_score){
    visitorWin = true;
  }

  element += '<td>';
  element += '<div class="' + (visitorWin?'':'win') + '">' + items[index].home + '</div>';
  element += '<div class="' + (visitorWin?'win':'') + '">' + items[index].visitor + '</div>';
  element += '</td>';
  element += '<td>';
  element += '<div class="' + (visitorWin?'':'win') + '">' + items[index].home_score + '</div>';
  element += '<div class="' + (visitorWin?'win':'') + '">' + items[index].visitor_score + '</div>';
  element += '</td>';
  return element;
}

function list(id) {
  $.ajax({
    type: 'GET',
    headers: {
      'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
    },
    url: "https://api-product.happytv.com.tw/api/v3/hbl/record/date/" + id
  }).done((data) => {


    console.log(data);
    let hide = 'style="display:none"';
    if (id === '2018-2-26'){
      hide = '';
    }
    let element = ' <table id="' +id+'" class="table table-bordered record-table" '+hide+' >';
    element += '<thead>';
    element += '<tr>';
    element += '<th>地點</th>';
    element += '<th>場次</th>';
    element += '<th>時間</th>';
    element += '<th class="team-cloumn">隊伍</th>';
    element += '<th>比數</th>';
    element += '<th>轉播</th>';
    element += '</tr>';
    element += '<tbody>';
    for (let key in data.result){
      let items = data.result[key];
      element += '<tr>';
      element += '<td rowspan="'+ items.length +'">'+key+'</td>'
      element += showGame(items, 0);

      element += '<td rowspan="'+ items.length +'" class="live">';
      element += 'APP Download<br><a href="# "><img src="images/hbl/happy-tv-logo.png "></a><br><br>';
      element += '粉絲團直播<br><a href="# "><img src="images/hbl/facebook-logo.png "></a><br><br>';
      element += 'Youtube 直播<br><a href="# "><img src="images/hbl/youtube-logo.png "></a>';
      element += '</td>';
      element += '</tr>';
      for(let i = 1; i < items.length; ++i){
       element += '<tr>';
       element += showGame(items, i);
       element += '</tr>'; 
      }
    }

    element += '</tbody>';
    element += '</thead>';
    element += '</table>';
    $("#tableContent").append(element);

    // let today = new Date();
    // const date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    // const date1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
    // const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 0, 0, 0);
    // let dateMap = {};
    // dateMap[Date.parse(date)] = '#today' + index + '';
    // dateMap[Date.parse(date1)] = '#secondDay' + index + '';
    // dateMap[Date.parse(date2)] = '#thirdDay' + index + '';
    // let dateBSMap = {};
    // dateBSMap[Date.parse(date)] = '#BStoday' + index + '';
    // dateBSMap[Date.parse(date1)] = '#BSsecond' + index + '';
    // dateBSMap[Date.parse(date2)] = '#BSthird' + index + '';


    //   for (let i = 1; i < data.result.program.length - 1; i++) {
    //     let channel = data.result.program[i];
    //     let startDate = data.result.program[i].startTime;
    //     let endDate = data.result.program[i].endTime;
    //     $(dateMap[Date.parse(data.result.program[i].date)]).text(data.result.program[i].date);
    //     $(dateBSMap[Date.parse(data.result.program[i].date)]).append('<div class="col-md-12 col-sm-12 col-xs-12">' +
    //       '<div class="panel panel-t col-md-12 col-sm-12 col-xs-12">' +
    //       '<div class="panel-timetable col-md-4 col-sm-6 col-xs-6">' +
    //       '<img class="img-responsive" src=' + image + '>' +
    //       '</div>' +
    //       '<div class="panel-tbody col-md-8 col-sm-6 col-xs-6">' +
    //       '<p class="text-t"><i class="fa " aria-hidden="true"></i>' + startDate + " ~ " + endDate +  '</p>' +
    //       '<h5 class="media-t">'  + channel.name + '</h5>' +
    //       '<p class="text-t">' + channel.remark + '</p>' +
    //       '</div>' +
    //       '</div>');
    //   }
  }).fail((data) => {
    console.log('error');
  });
}
