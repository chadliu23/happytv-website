function showProgramsInChannel(attr, index) {
  id = attr.split("#")[1];
  $('.record-table' + index).hide();
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

function list(id, targetid, index) {
  $.ajax({
    type: 'GET',
    headers: {
      'accesskey': 'accessKey_eb3604bd21a3176806f29607d47b069f17956cba'
    },
    url: "https://api-product.happytv.com.tw/api/v3/hbl/record/date/" + id
  }).done(function(data)  {

    let url = 'http://onelink.to/happytv';
    let hide = 'style="display:none"';
    let todayString = moment(new Date()).format('YYYY-MM-DD');
    if (id === todayString 
      ||  (new Date() > new Date('2018-03-03') && id === '2018-03-02' )
      ||  (new Date() > new Date('2018-04-21') && id === '2018-04-20' ) 
      ||  (new Date() < new Date('2018-04-16') && id === '2018-04-16' )   ){
      hide = '';
    }
    $('#'+todayString + '-tag').addClass('active');
    if ( new Date() >= new Date('2018-03-03') ){
      $('#2018-03-02-tag').addClass('active');
    }
    if ( new Date() <= new Date('2018-04-16') ){
      $('#2018-04-16-tag').addClass('active');
    }
    if ( new Date() >= new Date('2018-04-21') ){
      $('#2018-04-20-tag').addClass('active');
    }
    let element = ' <table id="' +id+'" class="table table-bordered record-table'+index +'" '+hide+' >';
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
        element += '<div class="web">APP Download</div><a href="'+url+'" target="_blank" ><img class="web" src="/images/hbl/happy-tv-logo.png "><img class="phone" src="/images/hbl/happy-tv-logo-phone.png"></a><br><br>';
      }
      if (items[0].facebook !== ''){
        element += '<div class="web">粉絲團直播</div><a href="'+items[0].facebook+'" target="_blank" ><img class="web" src="/images/hbl/facebook-logo.png "><img class="phone" src="/images/hbl/facebook-logo-phone.png"></a><br><br>';
      }
      if (items[0].youtube !== ''){
        element += '<div class="web">Youtube 直播</div><a href="'+items[0].youtube+'" target="_blank" ><img class="web" src="/images/hbl/youtube-logo.png "><img class="phone" src="/images/hbl/youtube-logo-phone.png"></a>';
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

  }).fail(function(data)  {
    console.log('error');
  });
}
