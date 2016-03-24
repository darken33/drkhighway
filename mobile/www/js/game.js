/**
 * game.js : script principal pour "The Highway"
 * 
 * Par Philippe Bousquet <darken33.free.fr>
 * Ce logiciel est sous license GNU Genral Public License v3.0
 */ 
 
var game_version  = "1.2";
var navplay = false;
var ready = false;
var popclosed = false;

function isFirefoxOS() {
	return (device.platform == "firefoxos");
}

/**
 * Initialisation de l'Application
 */ 
function init() {
	ready=false;
	popclosed=false;
	document.addEventListener("deviceready", onDeviceReady, true);		
	setTimeout(onDeviceReady, 5000);
}

/**
 * L'Appareil est pret
 */ 
function onDeviceReady() {
	if (!ready) {
		document.addEventListener("backbutton", onBackButton, true);
		document.querySelector("#game_lang").addEventListener("change", function onchange(event) {
			showPageLoading(); 
			updateParam(); 
			param();
			event.preventDefault();
		}, true);
		initCanvas();
		loadSounds();
		loadConfig();
	}
}

/**
 * Activation du jeu
 */ 
function activateApp() {
	if (!ready && ((isConfigLoaded() && isSoundReady()) || navplay)) {
		updateMenu();
		showPageTitre();
		bindGame();	
		ready = true;
		if (game_options.helponstart) {
			popclosed = false;
			popup();
		} 
		else {
			popclosed = true;
			setTimeout(showMenu, 2000);
		}
	}
}

/**
 * Affichage de la popup d'aide
 */ 
function popup() {
	$('#popup_content').html(texte_popup_normal[game_options.lang]);
	$("#helpOnStart").show();
}

/**
 * Fermerla popup
 */ 
function closePopUp() {
	$("#helpOnStart").hide();
	$("#titre").off("tap");
	popclosed=true;
	showMenu();
}

/**
 * Affichage du Menu
 */ 
function showMenu() {
	$("#menu").show();
}

/**
 * Affichage de la page de chargement 
 */ 
function showPageLoading() {
	$.mobile.changePage('#loading', 'none', true, true);
}

/**
 * Affichage de la page de titre
 */ 
function showPageTitre() {
	$.mobile.changePage('#titre', 'none', true, true);
}

/**
 * Affichage de la page de param
 */ 
function showPageParam() {
	$.mobile.changePage('#param', 'none', true, true);
}

function showPageHscToday() {
	$.mobile.changePage('#hsc_today', 'none', true, true);
}

function showPageHscInternet() {
	$.mobile.changePage('#hsc_internet', 'none', true, true);
}

/**
 * Affichage de la page de dons
 */ 
function showPageDons() {
	$('#dons_title').html(texte_menu_dons[game_options.lang]);
	$("#dons_content").html(texte_dons_content[game_options.lang]);
	$.mobile.changePage('#pdons', 'none', true, true);
}

/**
 * Affichage de la page d'aide
 */ 
function showPageAide() {
	$("#help_title").html(texte_menu_aide[game_options.lang]);
	$("#help_content").html(texte_aide_content[game_options.lang]);
	$.mobile.changePage('#aide', 'none', true, true);
}

/**
 * Affichage de la page de score
 */ 
function showPageScore() {
	$.mobile.changePage('#score', 'none', true, true);
}

/**
 * Mettre a jour le menu avec la langue
 */
function updateMenu() {
	$('#m_txt_jouer').html(texte_menu_jouer[game_options.lang]);
	$('#m_txt_param').html(texte_menu_param[game_options.lang]);
	$('#m_txt_aide').html(texte_menu_aide[game_options.lang]);
	$('#m_txt_dons').html(texte_menu_dons[game_options.lang]);
	$('#m_txt_quitter').html(texte_menu_quitter[game_options.lang]);
}

/**
 * Gestion du bouton retour
 */ 
function onBackButton() { 
}

/**
 * bindGame() - gestion des evenements sur l'ecran
 */ 
function bindGame() {
	$("#titre").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (!popclosed) closePopUp();
	});
	$("#m_txt_jouer").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		startGame();
	});
	$("#m_txt_param").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		param();
	});
	$("#m_txt_aide").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		showPageAide(); 
	});
	$("#m_txt_dons").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		showPageDons(); 
	});
	$("#m_txt_quitter").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		quit(); 
	});
	$("#param_back").on("tap", function(event) {
		event.preventDefault();
		event.stopPropagation();
		updateParam();
		showPageTitre();
	});
	$("#help_back").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		showPageTitre();
	});
	$("#b_score").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quitscore();
	});
	$("#dons_back").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		showPageTitre();
	});
	$("#b_hsc_today").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quithscl();
	});
	$("#b_hsc_internet").on("tap",  function(event) {
		event.preventDefault();
		event.stopPropagation();
		quithsci();
	});
// function(event) {
//		event.preventDefault();
//		event.stopPropagation();
//		special(event);
//	});
}

/**
 * quit() - quitter le jeu
 */ 
function quit() {
	navigator.notification.confirm(
		texte_alert_quitter[game_options.lang],
		quitConfirm,
		'Exit',
		['Ok','Cancel']
	);
}

function quitConfirm(btnIdx) {
	if (btnIdx == 1) {
		if (device.platform == "firefoxos") window.close();
		else navigator.app.exitApp();
		
	}
}
   
/**
 * param() - afficher la page des paramètres
 */ 
function param() {
	$('#txt_param').html(texte_param_title[game_options.lang]);
	game_lang = '<option value="fr" '+(game_options.lang == "fr" ? 'selected="selected"' : '')+'>'+texte_option_langue_fr[game_options.lang]+'</option>';
	game_lang += '<option value="en" '+(game_options.lang == "en" ? 'selected="selected"' : '')+'>'+texte_option_langue_en[game_options.lang]+'</option>';
	game_lang += '<option value="es" '+(game_options.lang == "es" ? 'selected="selected"' : '')+'>'+texte_option_langue_es[game_options.lang]+'</option>';
	$('#l_game_lang').html(texte_option_langage[game_options.lang]);
	$('#game_lang').html(game_lang).selectmenu().selectmenu("refresh");
	$('#l_game_name').html(texte_nom[game_options.lang]);
	$('#game_name').val(game_options.name);
	$('#l_options').html(texte_options[game_options.lang]);
	$('#l_game_help').html(texte_option_aide[game_options.lang]);
	$('#l_game_sound').html(texte_option_sons[game_options.lang]);
	$('#l_game_score').html(texte_option_share[game_options.lang]);
	$('#l_game_convert').html(texte_option_convert[game_options.lang]);
	$('#l_game_accel').html(texte_option_accel[game_options.lang]);
	if (game_options.helponstart) $('#game_help').prop('checked', true);
	if (game_options.soundactive) $('#game_sound').prop('checked', true);
	if (game_options.sharescore) $('#game_score').prop('checked', true);
	if (game_options.convert) $('#game_convert').prop('checked', true);
	if (game_options.accelerometer) $('#game_accel').prop('checked', true);
	$('#game_sound').checkboxradio().checkboxradio("refresh");
	$('#game_help').checkboxradio().checkboxradio("refresh");
	$('#game_score').checkboxradio().checkboxradio("refresh");
	$('#game_convert').checkboxradio().checkboxradio("refresh");
	$('#game_accel').checkboxradio().checkboxradio("refresh");
	showPageParam();
}

/**
 * updateparam() - MAJ des paramètres
 */ 
function updateParam() {
	game_options.lang = $('#game_lang').val();
	game_options.name = $('#game_name').val(); 
	game_options.helponstart = $('#game_help').is(":checked");
	game_options.soundactive = $('#game_sound').is(":checked");
	game_options.sharescore = $('#game_score').is(":checked");
	game_options.convert = $('#game_convert').is(":checked");
	game_options.accelerometer = $('#game_accel').is(":checked");
	saveConfig();
	updateMenu();
}
/**
 * startGame() - demarrer la partie
 */
function startGame() {
	showPageLoading();
	if (canvasLoaded) {
		$('body').addClass("noover");
		$.mobile.changePage('#game', 'none', true, true);	
		$("#game").on("vmousedown", moveCar);
		$("#game").on("vmouseup", stopCar);
		demarre();
	}
	else {
		setTimeout(startGame, 1000);
	}
}
   
/** initialisation automatique **/
init();
