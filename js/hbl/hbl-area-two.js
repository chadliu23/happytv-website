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
  element += '<div class="' + (items[index].visitor_score === items[index].home_score ? '':(visitorWin?'':'win')) + '">' + items[index].home + '</div>';
  element += '<div class="' + (items[index].visitor_score === items[index].home_score ? '':(visitorWin?'win':'')) + '">' + items[index].visitor + '</div>';
  element += '</td>';
  element += '<td>';
  element += '<div class="' + (items[index].visitor_score === items[index].home_score ? '':(visitorWin?'':'win')) + '">' + items[index].home_score + '</div>';
  element += '<div class="' + (items[index].visitor_score === items[index].home_score ? '':(visitorWin?'win':'')) + '">' + items[index].visitor_score + '</div>';
  element += '</td>';
  return element;
}

function list(id, targetid) {
  $.ajax({
    type: 'GET',
    headers: {
      'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
    },
    url: "https://api-product.happytv.com.tw/api/v3/hbl/record/date/" + id
  }).done((data) => {

    let url = 'https://tw.piliapp.com/generator/qr-code/apps/?iphone=https%3A%2F%2Fitunes.apple.com%2Ftw%2Fapp%2F%25E5%25BF%25AB%25E6%25A8%2582%25E9%259B%25BB%25E8%25A6%2596%2Fid1166854716%3Fmt%3D8%26ign-mpt%3Duo%253D4&ipad=https%3A%2F%2Fitunes.apple.com%2Ftw%2Fapp%2F%25E5%25BF%25AB%25E6%25A8%2582%25E9%259B%25BB%25E8%25A6%2596%2Fid1166854716%3Fmt%3D8%26ign-mpt%3Duo%253D4&android=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.happytvtw.happtvlive';
    let hide = 'style="display:none"';
    let todayString = moment(new Date()).format('YYYY-MM-DD');
    if (id === todayString || (new Date() > new Date('2018-03-03') && id === '2018-02-26'  ) ){
      hide = '';
    }
    $('#'+todayString + '-tag').addClass('active');
    if ( new Date() > new Date('2018-03-03') ){
      $('#2018-02-26-tag').addClass('active');
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
      element += '<td rowspan="'+ items.length +'">'+key.replace(/\d/, '') +'</td>'
      element += showGame(items, 0);

      element += '<td rowspan="'+ items.length +'" class="live">';
      if (items[0].channel_id !== ''){
        element += '<div class="web">APP Download</div><a href="'+url+'"><img class="web" src="/images/hbl/happy-tv-logo.png "><img class="phone" src="/images/hbl/happy-tv-logo-phone.png"></a><br><br>';
      }
      if (items[0].facebook !== ''){
        element += '<div class="web">粉絲團直播</div><a href="'+items[0].facebook+'"><img class="web" src="/images/hbl/facebook-logo.png "><img class="phone" src="/images/hbl/facebook-logo-phone.png"></a><br><br>';
      }
      if (items[0].youtube !== ''){
        element += '<div class="web">Youtube 直播</div><a href="'+items[0].youtube+'"><img class="web" src="/images/hbl/youtube-logo.png "><img class="phone" src="/images/hbl/youtube-logo-phone.png"></a>';
      }
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
    $("#" + targetid).append(element);

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
