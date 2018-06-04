function setLoadingBlock() {
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
}

var teamIdMap = {}

$(document).ready(function(){
	if (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())) {
		$(".content").addClass("hide")
		alert('請使用電腦版網站搜尋')
		history.go(-1)　
	}


	$.ajax({
      type: 'GET',
      dataType: 'json',
      url: happyApiHost + '/api/v3/egame/2018-01/allTeam'
    }).done(function(data)  {
    	console.log(data)
      if (data.result.length === 0) {
        return
      }

      return putInTeam(data.result)
    }).fail(function(data) {
      console.log('失敗')
    });

    function putInTeam(teams) {
    	var availableTags = []
    	teams.forEach(function(team, i){
    		availableTags.push(team.team_name)
    		teamIdMap[team.team_name] = team.team_id
    	})

	    $( "#team_name_search" ).autocomplete({
	      source: availableTags
	    });
    }
})

$(document).on('change', '#team_name_search',  function(e) {
	$("#search-form").submit();
})
$(document).on('click', '.btn_search',  function(e) {
	$("#search-form").submit();
})
$(document).on('submit', '#search-form',  function(e) {
//$("#search-form").submit(function (e) {
	e.preventDefault();

	var team_name = $( "#team_name_search" ).val()
	var team_id = teamIdMap[team_name]

	if(!team_id) {
		return
	}

	setLoadingBlock()

  	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: happyApiHost + '/api/v3/egame/2018-01/search/team/' + team_id
	}).done(function(data)  {
			console.log(data)
		if (data.result.length === 0) {
			$.unblockUI()
			return
		}

		$("#team_name_p").html(data.result[0].team_name)

		for(var i=0; i<=6; i++) {
			if(data.result[i]) {
				$("#summoner_" + i + "_p .name").html(data.result[i].summoner)
				$("#summoner_" + i + "_p .school").html(data.result[i].school_name)
			}
		}

	  	$.unblockUI()
	}).fail(function(data) {
	  	console.log('失敗')
	  	$.unblockUI()
	});

})