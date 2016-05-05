
function quitscore() {
	if (game_options.sharescore) {
		showPageHscToday();	
	}
	else {
		showPageTitre();
	}
}

function quithscl() {
	showPageHscInternet();
} 

function quithsci() {
	showPageTitre();
}

function service(score) {
	var d = new Date();
	var txd=d.getFullYear()+(d.getMonth() < 9 ? "0" : "")+(d.getMonth()+1)+(d.getDate() < 10 ? "0" : "")+d.getDate();  
	var tableScore = "<tr><td>"+texte_loading[game_options.lang]+"</td></tr>";
	document.getElementById("tx_hsc_today").innerHTML = texte_meilleur_score_dujour[game_options.lang];
	document.getElementById("tx_hsc_internet").innerHTML = texte_meilleur_score_mondial[game_options.lang];
	document.getElementById("t_hsc_today").innerHTML = tableScore;
	document.getElementById("t_hsc_internet").innerHTML = tableScore;
	var key = "5f41236c78401a027cabea54f66ed4b2";
	var name = game_options.name;
	var score = score;
	var url = "http://darken33.net/applications/services/drkhighway/score_service.php?key="+key+"&name="+name+"&score="+score+"&date="+txd;
	$.getJSON(url, function(data) {
		fillHighscores(data);
	}).fail(function() { 
		var tableScore = '<tr><td style="color: #FF0000">'+texte_erreur_chargement_score[game_options.lang]+'</td></tr>';
		document.getElementById("t_hsc_today").innerHTML = tableScore;
		document.getElementById("t_hsc_internet").innerHTML = tableScore;
	});
}		

function fillHighscores(data) {
	var tableScore = "<tr><th>#</th><th>"+texte_hsc_nom[game_options.lang]+"</th><th>"+texte_hsc_score[game_options.lang]+"</th></tr>";
	var tableScore2 = "<tr><th>#</th><th>"+texte_hsc_nom[game_options.lang]+"</th><th>"+texte_hsc_score[game_options.lang]+"</th></tr>";
	var tabscores = data;
	var i=0;
	var playerFound = false;
	for (i=0; i<10; i++) {
		if (i < tabscores.length && tabscores[i].type != "today") break;  
		if (i < tabscores.length) {
			cl = (tabscores[i].isplayer == 1 ? "hlg" : "");
			tableScore += '<tr><td style="text-align: right;" class="'+cl+'">'+tabscores[i].pos+'.</td>' +
					'<td style="text-align: left;" class="'+cl+'">'+tabscores[i].name+'</td>' +
					'<td style="text-align: right;" class="'+cl+'">'+tabscores[i].score+'</td></tr>';
			if (tabscores[i].isplayer == 1) playerFound=true;		
		}
	}
	if (tabscores[i].type == "today" && !playerFound) {
		tableScore += '<tr><td style="text-align: center;" colspan="3">...</td></tr>';
		cl = "hlg";
		tableScore += '<tr><td style="text-align: right;" class="'+cl+'">'+tabscores[i].pos+'.</td>' +
					'<td style="text-align: left;" class="'+cl+'">'+tabscores[i].name+'</td>' +
					'<td style="text-align: right;" class="'+cl+'">'+tabscores[i].score+'</td></tr>';
		i++;			
	}
	var j=i;
	playerFound = false;
	for (j=i; j<(i+10); j++) {
		if (j < tabscores.length) {
			cl = (tabscores[j].isplayer == 1 ? "hlg" : "");
			tableScore2 += '<tr><td style="text-align: right;" class="'+cl+'">'+tabscores[j].pos+'.</td>' +
					'<td style="text-align: left;" class="'+cl+'">'+tabscores[j].name+'</td>' +
					'<td style="text-align: right;" class="'+cl+'">'+tabscores[j].score+'</td></tr>';
			if (tabscores[j].isplayer == 1) playerFound=true;		
		}
	}
	if (!playerFound) {
		tableScore2 += '<tr><td style="text-align: center;" colspan="3">...</td></tr>';
		cl = "hlg";
		tableScore2 += '<tr><td style="text-align: right;" class="'+cl+'">'+tabscores[j].pos+'.</td>' +
					'<td style="text-align: left;" class="'+cl+'">'+tabscores[j].name+'</td>' +
					'<td style="text-align: right;" class="'+cl+'">'+tabscores[j].score+'</td></tr>';
		i++;			
	}
	document.getElementById("t_hsc_today").innerHTML = tableScore;
	document.getElementById("t_hsc_internet").innerHTML = tableScore2;
}
