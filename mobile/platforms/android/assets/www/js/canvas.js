var	manifest = [
	{src:"images/back.png", id:"back"},
	{src:"images/car-red-top-view.png", id:"car01"},
	{src:"images/car-dark-blue-top-view.png", id:"car02"},
	{src:"images/car-green-top-view.png", id:"car03"},
	{src:"images/car-light-green-top-view.png", id:"car04"},
	{src:"images/car-orange-top-view.png", id:"car05"},
	{src:"images/car-pink-top-view.png", id:"car06"},
	{src:"images/car-purple-top-view.png", id:"car07"},
	{src:"images/car-blue-top-view.png", id:"car08"},
	{src:"images/car-yellow-top-view.png", id:"car09"},
	{src:"images/explode.png", id:"explode"},
	{src:"images/coin-up.png", id:"coin"},
	{src:"images/car-red-plane-view.png", id:"plane01"}
];
/* Taille de l'écran */
var width;
var height;
/* Les divers objets du canvas */
var stage;
var coinsplan;
var ground;
var carsplan;
var car01;
var car01Img;
var plane01;
var plane01Img;
var explode;
var adversaires = [];
var coins = [];
var score=0;
/* Les diverses vitesses */
var vitesse = 1;
var vitesseMax = 700;
var vitesseIncr = 5;
var carSpeed = 0;
var carSpeedMax = 250;
var adversaireSpeed = 0;
var adversaireSpeedMax = -350;
var adversaireSpeedMin = -50;
var adversaireSpeedIncr = 50;
/* gestion des adversaires */
var twoprob=0;
var thread_adversaire = null;
var count=0;
var delai = 0;
var delaiMax = 2000;
var delaiMin = 1600;
var second = 1000;
var gameEnded = true;
/* gestion des pieces */
var coinprob=101;
var showcoin=true;
var nbcoins=0;
var earnedcoins=0;
var cprob=0;
var brakeCost=5;
var hornCost=10;
var planeCost=20;
var planeDuration=5;
/* gestion du canvas */
var canvasLoaded = false;
var scale = 1;
var xMin=55;
var xMax=325;
var yMax=800;
var yMin=-210;
var timerMax=5;
var timer=0;
var timer_thread=null;
var option_valide=false;
/**
 * Initiailisation du canvas
 */ 
function initCanvas() {
	stage = new createjs.Stage("myCanvas");
	// on conserve la taille originale
	width = stage.canvas.width;
	height = stage.canvas.height;
	// On charge les images
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest);
	// On aplique la taille de l'ecran et on calcule le facteur de scale
	$("#myCanvas").attr("height",window.innerHeight);
		if (window.innerWidth >= 1024) { 
		$("#myCanvas").attr("width",1024);
		scale=1024/480;
		icon=128;
	}
	if (window.innerWidth < 1024) {
		$("#myCanvas").attr("width",800);
		scale=800/480;
		icon=128;
	}
	if (window.innerWidth < 800) {
		$("#myCanvas").attr("width",720);
		scale=720/480;
		icon=128;
	}
	if (window.innerWidth < 720) {
		$("#myCanvas").attr("width",640);
		scale=640/480;
		icon=128;
	}
	if (window.innerWidth < 640) {
		$("#myCanvas").attr("width",600);
		scale=600/480;
		icon=128;
	}	
	if (window.innerWidth < 600) {
		$("#myCanvas").attr("width",512);
		scale=512/480;
		icon=64;
	}	
	if (window.innerWidth < 512) {
		$("#myCanvas").attr("width",480);
		scale=480/480;
		icon=64;
	}	
	if (window.innerWidth < 480) {
		$("#myCanvas").attr("width",400);
		scale=400/480;
		icon=64;
	}	
	if (window.innerWidth < 400) {
		$("#myCanvas").attr("width",320);
		scale=320/480;
		icon=64;
	}	
	if (window.innerWidth < 320) {
		$("#myCanvas").attr("width",240);
		scale=240/480;
		icon=32;
	}	
}

/**
 * Le canvas est initialisé
 */
function handleComplete() {
	canvasLoaded = true;
	// On crée l'arrière plan
	var groundImg = loader.getResult("back");
	ground = new createjs.Shape();
	ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0-groundImg.height, groundImg.width, groundImg.height*2.5);
	ground.tileH = groundImg.height;
	ground.y = 0;
	// On crée la voiture
	car01Img = loader.getResult("car01");
	car01 = new createjs.Bitmap(car01Img);
	car01.x = (width - car01Img.width) / 2;
	car01.y = height - car01Img.height - 5;
	// On crée la voiture en mode avion
	plane01Img = loader.getResult("plane01");
	plane01 = new createjs.Bitmap(plane01Img);
	plane01.x = (width - plane01Img.width) / 2;
	plane01.y = height - plane01Img.height - 5;
	// on applique le facteur de scale
    stage.scaleX = scale;
    stage.scaleY = scale;
}

/**
 * Démarrer la partie
 */
function demarre() {
	// on place la voiture
	car01.x = (width - car01Img.width) / 2;
	car01.y = height - car01Img.height - 5;
	plane01.x = (width - plane01Img.width) / 2;
	plane01.y = height - plane01Img.height - 5;
	// on initiailise les vitesses
	vitesse=0;
	carSpeed=0;
	earnedcoins=0;
	adversaireSpeed=adversaireSpeedMax;
	// on intialise divers paramètres de jeu
	delai=delaiMax;
	twoprob=0;
	showcoin=false;
	gameEnded = false;
	nbcoins=0;
	score=0;
	option_valide=true;
	// on initialise les pieces et adversaires
	adversaires=[];
	coins=[];
	// on initialises les boutons d'options
	if (game_options.coins >= 20) {
		$("#plane").removeClass("poff");
		$("#plane").addClass("pon");
	}
	else {
		$("#plane").removeClass("pon");
		$("#plane").addClass("poff");
	}
	if (game_options.coins >= 10) {
		$("#horn").removeClass("hoff");
		$("#horn").addClass("hon");
	}
	else {
		$("#horn").removeClass("hon");
		$("#horn").addClass("hoff");
	}
	if (game_options.coins >= 5) {
		$("#brake").removeClass("boff");
		$("#brake").addClass("bon");
	}
	else {
		$("#brake").removeClass("bon");
		$("#brake").addClass("boff");
	}
	// on positionne les divers sprites
	coinsplan = new createjs.Container();
	carsplan = new createjs.Container();
	stage.addChild(ground, coinsplan, carsplan, car01);
	// on crée la boucle
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
	if (game_options.soundactive) {
		m_motor.play();
		// deuxieme moteur pour eviter la coupure du replay
		setTimeout(function() { m_motor2.play(); }, second);
	}
}	

/**
 * Une option est pressée
 */
function special(event) {
	// On freine
	if (event.clientX > ((window.innerWidth - icon) / 2) && event.clientX < ((window.innerWidth + icon) / 2)) {
		if (game_options.coins >= brakeCost) {
			option_valide = false;
			setTimeout(function(){option_valide=true;},second);			
			game_options.coins-=brakeCost;
			earnedcoins-=brakeCost;
			if (earnedcoins<0) earnedcoins=0;
			vitesse=0;
			clearInterval(thread_adversaire);
			thread_adversaire=null;
			if (game_options.soundactive) m_brake.play();
		}
	}
	// On klaxonne
	else if (event.clientX > (window.innerWidth * 0.8 - icon * 0.5) && event.clientX < (window.innerWidth * 0.8 + icon * 0.5)) {
		if (game_options.coins >= hornCost) {
			option_valide = false;
			setTimeout(function(){option_valide=true;},second);			
			game_options.coins-=hornCost;
			earnedcoins-=hornCost;
			if (earnedcoins<0) earnedcoins=0;
			pos = xMax;
			if (car01.x+(car01Img.width/2) < 175) pos = xMin;
			else if (car01.x+(car01Img.width/2) < 305) pos = (width - car01Img.width) / 2;
			if (game_options.soundactive) m_horn2.play();
			for (i = adversaires.length; i > 0; i--) {
				if (adversaires[i-1].x == pos) {
					score+=100;
					showcoin = (Math.floor((Math.random() * 100) + 1) < coinprob);
					carsplan.removeChild(adversaires[i-1]);
					adversaires.splice(i-1,1);
				}
			}
		}
	}
	// On se transforme en jet
	else if (event.clientX > (window.innerWidth * 0.2 - icon * 0.5) && event.clientX < (window.innerWidth * 0.2 + icon * 0.5)) {
		if (game_options.coins >= planeCost) {
			option_valide = false;
			setTimeout(function(){option_valide=true;},5*second);			
			game_options.coins-=planeCost;
			earnedcoins-=planeCost;
			if (earnedcoins<0) earnedcoins=0;
			if (game_options.soundactive) m_takeoff.play();
			stage.removeChild(car01);
			stage.addChild(plane01);
			timer=timerMax;
			timer_thread=setInterval(timerDown, second);	
		}
	}
}  

function timerDown() {
		timer--;
		if (timer==0) {
			stage.removeChild(plane01);
			stage.addChild(car01);
			clearInterval(timer_thread);
			timer_thread=null;	
		}
}
/**
 * on dirige la voiture
 */
function moveCar(event) {
	event.preventDefault();
	event.stopPropagation();
	if (event.clientY < window.innerHeight - icon) {
		if (event.clientX > (window.innerWidth / 2)) {
			carSpeed = carSpeedMax;
		}
		else {
			carSpeed = -1 * carSpeedMax;
		}
	}
	else if (option_valide) {
		special(event);
	}
}

/**
 * Arrêter la voiture
 */  
function stopCar(event) {
	event.preventDefault();
	event.stopPropagation();
	carSpeed = 0;
}
/**
 * Gestion des boutons 
 */ 
function updateOptions() {
	if (game_options.coins >= planeCost && $("#plane").hasClass("poff")) {
		$("#plane").removeClass("poff");
		$("#plane").addClass("pon");
	}
	else if (game_options.coins < planeCost && $("#plane").hasClass("pon")) {
		$("#plane").removeClass("pon");
		$("#plane").addClass("poff");
	}
	if (game_options.coins >= hornCost && $("#horn").hasClass("hoff")) {
		$("#horn").removeClass("hoff");
		$("#horn").addClass("hon");
	}
	else if (game_options.coins < hornCost && $("#horn").hasClass("hon")) {
		$("#horn").removeClass("hon");
		$("#horn").addClass("hoff");
	}
	if (game_options.coins >= brakeCost && $("#brake").hasClass("boff")) {
		$("#brake").removeClass("boff");
		$("#brake").addClass("bon");
	}
	else if (game_options.coins < brakeCost && $("#brake").hasClass("bon")) {
		$("#brake").removeClass("bon");
		$("#brake").addClass("boff");
	}
}

/**
 * Rafraichissement
 */ 
function tick(event) {
	// on calcule le deltaS pour la fluidité
	var deltaS = event.delta / second;
	// On deplace l'arrière plan
	ground.y = (ground.y+deltaS*vitesse) % ground.tileH;
	// gestion des options
	updateOptions();
	// On déplace la voiture si besoin
	if ((car01.x > 55 && carSpeed < 0) || (carSpeed > 0 && car01.x < 325)) {
		car01.x = (car01.x+deltaS*carSpeed);
		plane01.x = (plane01.x+deltaS*carSpeed);
	}
	// On met a jour  la vitesse
	if (vitesse<700) vitesse+=5;
	if (vitesse==600 && thread_adversaire == null) {
		thread_adversaire = setInterval(updateAdversaire, delai);
	}
	// Les pièces
	for (j = coins.length; j > 0; j--) {
		coins[j-1].y = coins[j-1].y+deltaS*(vitesse);
		if (testRamasse(j-1)) {
			game_options.coins++;
			earnedcoins++; 
			if (game_options.soundactive) m_cash.play();
			coinsplan.removeChild(coins[j-1]);
			coins.splice(j-1,1);
		}
		else if (coins[j-1].y > yMax) {
			coinsplan.removeChild(coins[j-1]);
			coins.splice(j-1,1);
		}	
	}
	// On passe en revue les adversaires
	for (i = adversaires.length; i > 0; i--) {
		adversaires[i-1].y = adversaires[i-1].y+deltaS*(vitesse+adversaireSpeed);
		if (timer==0 && testCollision(i-1)) { 
			gameEnded = true;
		}
		if (adversaires[i-1].y > yMax) {
			score+=100;
			if (game_options.soundactive) {
				m_horn.play();
			}
			showcoin = true; //(Math.floor((Math.random() * 100) + 1) < coinprob);
			carsplan.removeChild(adversaires[i-1]);
			adversaires.splice(i-1,1);
		}
	}
	// On affiche les scores et pièces 
	score++;
	$("#score").html(score);
	$("#coins").html(game_options.coins);
	$("#timer").html(timer != 0 ? timer : "");
	// On met à jour le canvas
	stage.update(event);
	// Fin du jeu
	if (gameEnded) endGame();		
}

/**
 * On ajoute un adversaire
 */ 
function updateAdversaire() {
	if (adversaires.length < 3) {
		var car = Math.floor((Math.random() * 8) + 2); 	  
		var pro = (Math.floor((Math.random() * 100) + 1) < twoprob); 	  
		var pos = (width - 100);
		if (car01.x+(car01Img.width/2) < 175) {
			pos = (Math.floor((Math.random() * 2) + 1) == 1 ? xMin : (Math.floor((Math.random() * 2) + 1) == 1 ? (width - car01Img.width) / 2 : xMax)); 
		}	
		else if (car01.x+(car01Img.width/2) < 305) {
			pos = (Math.floor((Math.random() * 2) + 1) == 1 ? (width - car01Img.width) / 2 : (Math.floor((Math.random() * 2) + 1) == 1 ? xMin : xMax)); 
		}	
		else {
			pos = (Math.floor((Math.random() * 2) + 1) == 1 ? xMax : (Math.floor((Math.random() * 2) + 1) == 1 ? xMin : (width - car01Img.width) / 2)); 
		}	
		adversaires.push(new createjs.Bitmap(loader.getResult("car0"+car)));
		adversaires[adversaires.length-1].x = pos; 
		adversaires[adversaires.length-1].y = yMin;
		carsplan.addChild(adversaires[adversaires.length-1]);
		// une seconde voiture ?
		if (pro) {
			var car2 = Math.floor((Math.random() * 8) + 2); 	  
			adversaires.push(new createjs.Bitmap(loader.getResult("car0"+car2)));
			var pos2 = Math.floor((Math.random() * 2) + 1); 	  
			if (pos==xMin) {
				adversaires[adversaires.length-1].x = (pos2 == 1 ? (width - car01Img.width) / 2 : xMax); 
			}
			else if (pos==xMax) {
				adversaires[adversaires.length-1].x = (pos2 == 1 ? xMin : (width - car01Img.width) / 2); 
			}
			else {
				adversaires[adversaires.length-1].x = (pos2 == 1 ? xMin : xMax); 
			}
			adversaires[adversaires.length-1].y = yMin;
			carsplan.addChild(adversaires[adversaires.length-1]);
		}
		if (showcoin) {
			updateCoins();
			showcoin = false;
		}	
	}
	count++;
	// toutes les 10 voitures on monte la difficulté
	if (count==10) {
		if (delai > delaiMin) {
			delai -=100;
			if (vitesse == vitesseMax && thread_adversaire != null) {
				clearInterval(thread_adversaire);
				thread_adversaire = null;
				thread_adversaire = setInterval(updateAdversaire, delai);
			}
		}
		if (adversaireSpeed<adversaireSpeedMin) {
			adversaireSpeed+=adversaireSpeedIncr;
		}
		if (twoprob < 75) {
			twoprob += 15;
		}
		count=0;
	}
}

/**
 * On ajoute un adversaire
 */ 
function updateCoins() {
	if (coins.length < 1) {
		var num = (Math.floor((Math.random() * 3) + 1));
		var pos = (num == 1 ? 80 : num == 2 ? (width - 50) / 2 : 350); 
		coins.push(new createjs.Bitmap(loader.getResult("coin")));
		coins[coins.length-1].x = pos; 
		coins[coins.length-1].y = -105;
		coinsplan.addChild(coins[coins.length-1]);
		nbcoins++;
		coinprob=30;
	}
}

/**
 * Tester la colision avec l'adversaire
 */ 
function testCollision(j) {
	var explodeImg = loader.getResult("explode");
	explode = new createjs.Bitmap(explodeImg);
	var coll=false;
	if (car01.x >= adversaires[j].x && car01.x <= adversaires[j].x+100 && 
		car01.y >= adversaires[j].y && car01.y <= adversaires[j].y+202) {
		explode.x = car01.x - 35;
		explode.y =	car01.y - 38;
		coll=true;
	}
	if (car01.x+100 >= adversaires[j].x && car01.x+100 <= adversaires[j].x+100 && 
		car01.y >= adversaires[j].y && car01.y <= adversaires[j].y+202) {
		explode.x = car01.x + 100 - 55;
		explode.y =	car01.y - 38;
		coll=true;
	}
	if (car01.x >= adversaires[j].x && car01.x <= adversaires[j].x+100 && 
		car01.y+202 >= adversaires[j].y && car01.y+202 <= adversaires[j].y+202) {
		explode.x = car01.x - 35;
		explode.y =	car01.y + 202 - 38;
		coll=true;
	}
	if (car01.x+100 >= adversaires[j].x && car01.x+100 <= adversaires[j].x+100 && 
		car01.y+202 >= adversaires[j].y && car01.y+202 <= adversaires[j].y+202) {
		explode.x = car01.x + 100 - 55;
		explode.y =	car01.y + 202 - 38;
		coll=true;
	}
	if(coll) {
		if (game_options.soundactive) {
			if (isFirefoxOS()) {
				m_motor.pause();
				m_motor.currentTime=0.0;
				m_motor2.pause();
				m_motor2.currentTime=0.0;
			}
			else {
				m_motor.stop();
				m_motor2.stop();
			}
			m_crash.play();
		}
		stage.addChild(explode);
	}
	return coll;
}

function testRamasse(j) {
	var ram=false;
	if (coins[j].x >= car01.x && coins[j].x <= car01.x +100 && 
		coins[j].y >= car01.y && coins[j].y <= car01.y +202) {
		ram=true;
	}
	if (coins[j].x+50 >= car01.x && coins[j].x+50 <= car01.x +100 && 
		coins[j].y >= car01.y && coins[j].y <= car01.y +202) {
		ram=true;
	}
	if (coins[j].x >= car01.x && coins[j].x <= car01.x +100 && 
		coins[j].y+50 >= car01.y && coins[j].y+50 <= car01.y +202) {
		ram=true;
	}
	if (coins[j].x >= car01.x+50 && coins[j].x+50 <= car01.x +100 && 
		coins[j].y >= car01.y+50 && coins[j].y+50 <= car01.y +202) {
		ram=true;
	}
	return ram;
}

/**
 * Fin de partie
 */ 
function endGame() {	
	option_valide=false;
	createjs.Ticker.reset();
	clearInterval(thread_adversaire);
	thread_adversaire=null;
	stage.removeAllChildren();
	createjs.Ticker.removeAllEventListeners();
	car01.x = (width - 100) / 2;
	car01.y = height - 207;
	vitesse=0;
	carSpeed=0;
	adversaires=[];
	coins=[];
	$("#convert_ok").hide();
	$("#score_intrm").html(score);
	$("#score_coins").html(earnedcoins);
	if (game_options.convert) {
		score+=(earnedcoins * 100);
		game_options.coins-=earnedcoins;
		$("#convert_ok").show();
	}
	$("#score_final").html(score);
	if (game_options.sharescore) service(score);
	$('body').removeClass("noover");
	saveConfig();
	setTimeout(showPageScore, 2000);
}
