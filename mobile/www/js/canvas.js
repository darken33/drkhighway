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
	{src:"images/explode.png", id:"explode"}
];
var stage;
var width;
var height;
var ground;
var car01;
var explode;
var canvasLoaded = false;
var vitesse = 1;
var carSpeed = 0;
var adversaireSpeed = -350;
var scale = 1;
var container;
var adversaires = [];
var thread_adversaire = null;
var count=0;
var delai = 2000;
var gameEnded = true;
var carSpeedMax = 250;
var twoprob=0;

/**
 * Initiailisation du canvas
 */ 
function initCanvas() {
	stage = new createjs.Stage("myCanvas");
	width = stage.canvas.width;
	height = stage.canvas.height;
	$("#myCanvas").attr("height",window.innerHeight);
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest);
	if (window.innerWidth >= 1024) { 
		$("#myCanvas").attr("width",1024);
		scale=1024/480;
	}
	if (window.innerWidth < 1024) {
		$("#myCanvas").attr("width",800);
		scale=800/480;
	}
	if (window.innerWidth < 800) {
		$("#myCanvas").attr("width",720);
		scale=720/480;
	}
	if (window.innerWidth < 720) {
		$("#myCanvas").attr("width",640);
		scale=640/480;
	}
	if (window.innerWidth < 640) {
		$("#myCanvas").attr("width",600);
		scale=600/480;
	}	
	if (window.innerWidth < 600) {
		$("#myCanvas").attr("width",512);
		scale=512/480;
	}	
	if (window.innerWidth < 512) {
		$("#myCanvas").attr("width",480);
		scale=480/480;
	}	
	if (window.innerWidth < 480) {
		$("#myCanvas").attr("width",400);
		scale=400/480;
	}	
	if (window.innerWidth < 400) {
		$("#myCanvas").attr("width",320);
		scale=320/480;
	}	
	if (window.innerWidth < 320) {
		$("#myCanvas").attr("width",240);
		scale=240/480;
	}	
}

/**
 * Le canvas est initialisé
 */
function handleComplete() {
	canvasLoaded = true;

	var groundImg = loader.getResult("back");
	ground = new createjs.Shape();
	ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0-groundImg.height, groundImg.width, groundImg.height*2.5);
	ground.tileH = groundImg.height;
	ground.y = 0;

	var car01Img = loader.getResult("car01");
	car01 = new createjs.Bitmap(car01Img);
	car01.x = (width - car01Img.width) / 2;
	car01.y = height - car01Img.height - 5;
	
    stage.scaleX = scale;
    stage.scaleY = scale;

}

/**
 * Démarrer la partie
 */
function demarre() {
	car01.x = (width - 100) / 2;
	car01.y = height - 207;
	vitesse=0;
	carSpeed=0;
	carSpeedMax=275;
	adversaires=[];
	adversaireSpeed=-350;
	count=0;
	score=0;
	delai=2000;
	twoprob=0;
	gameEnded = false;
	stage.addChild(ground, car01);
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.addEventListener("tick", tick);
	if (game_options.soundactive) {
		m_motor.play();
		setTimeout(function() { m_motor2.play(); }, 1000);
	}
}	

/**
 * Diriger la voitue
 */ 
function moveCar(event) {
	event.preventDefault();
	event.stopPropagation();
	if (event.clientX > (window.innerWidth / 2)) {
		carSpeed = carSpeedMax;
	}
	else {
		carSpeed = -1 * carSpeedMax;
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
 * Rafraichissement
 */ 
function tick(event) {
	var deltaS = event.delta/1000;
	ground.y = (ground.y+deltaS*vitesse) % ground.tileH;
	if ((car01.x > 55 && carSpeed < 0) || (carSpeed > 0 && car01.x < 325)) car01.x = (car01.x+deltaS*carSpeed);
	for (i = 0; i < adversaires.length; i++) {
		adversaires[i].y = adversaires[i].y+deltaS*(vitesse+adversaireSpeed);
		if (testCollision(i)) { 
			gameEnded = true;
		}
		if (adversaires[i].y > 800) {
			score+=100;
			if (game_options.soundactive) {
				m_horn.play();
			}
			stage.removeChild(adversaires[i])
		}
	}
	if (!gameEnded) {
		if (vitesse<700) vitesse+=5;
		if (vitesse==695) {
			thread_adversaire = setInterval(updateAdversaire, delai);
		}
		for (i = 0; i < adversaires.length; i++) {
			if (adversaires[i].y > 800) {
				adversaires.splice(i,1);
				break;
			}
		}
		score++;
		$("#score").html(score+"  ");
		stage.update(event);
	}
	else {
		$("#score").html(score+"  ");
		stage.update(event);
		endGame();		
	}
}

/**
 * On ajoute un adversaire
 */ 
function updateAdversaire() {
	if (adversaires.length < 3) {
		var car = Math.floor((Math.random() * 8) + 2); 	  
		var pro = (Math.floor((Math.random() * 100) + 1) < twoprob); 	  
		var pos = (width - 100);
		if (car01.x < 175) {
			pos = (Math.floor((Math.random() * 2) + 1) == 1 ? 55 : (Math.floor((Math.random() * 2) + 1) == 1 ? (width - 100) / 2 : 325)); 
		}	
		else if (car01.x < 305) {
			pos = (Math.floor((Math.random() * 2) + 1) == 1 ? (width - 100) / 2 : (Math.floor((Math.random() * 2) + 1) == 1 ? 55 : 325)); 
		}	
		else {
			pos = (Math.floor((Math.random() * 2) + 1) == 1 ? 325 : (Math.floor((Math.random() * 2) + 1) == 1 ? 55 : (width - 100) / 2)); 
		}	
		adversaires.push(new createjs.Bitmap(loader.getResult("car0"+car)));
		adversaires[adversaires.length-1].x = pos; 
		adversaires[adversaires.length-1].y = -210;
		stage.addChild(adversaires[adversaires.length-1]);
		if (pro) {
			var car2 = Math.floor((Math.random() * 8) + 2); 	  
			adversaires.push(new createjs.Bitmap(loader.getResult("car0"+car2)));
			var pos2 = Math.floor((Math.random() * 2) + 1); 	  
			if (pos==55) {
				adversaires[adversaires.length-1].x = (pos2 == 1 ? (width - 100) / 2 : 325); 
			}
			else if (pos==325) {
				adversaires[adversaires.length-1].x = (pos2 == 1 ? 55 : (width - 100) / 2); 
			}
			else {
				adversaires[adversaires.length-1].x = (pos2 == 1 ? 55 : 325); 
			}
			adversaires[adversaires.length-1].y = -210;
			stage.addChild(adversaires[adversaires.length-1]);
		}
	}
	count++;
	if (count==10) {
		if (delai > 1600) {
			delai -=100;
			clearInterval(thread_adversaire);
			thread_adversaire = setInterval(updateAdversaire, delai);
		}
		if (adversaireSpeed<-50) {
			adversaireSpeed+=50;
		}
		if (twoprob < 75) {
			twoprob += 15;
		}
		count=0;
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

/**
 * Fin de partie
 */ 
function endGame() {
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
	$("#score_final").html(score);
	if (game_options.sharescore) service(score);
	$('body').removeClass("noover");
	setTimeout(showPageScore, 2000);
}
