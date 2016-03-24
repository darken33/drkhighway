var lastX,lastY,lastZ;
var moveCounter = 0;

/**
 * updateAcceleration() - Code pour l'accelerometer
 */ 			
function updateAcceleration(a) {
	if(!lastX) {
		lastX = Math.round(a.x * 100);
		lastY = Math.round(a.y * 100);
		lastZ = Math.round(a.z * 100);
		return;
	}

	var deltaX, deltaY, deltaZ;
	deltaX = Math.round(a.x * 100)-lastX;
	deltaY = Math.round(a.y * 100)-lastY;
	deltaZ = Math.round(a.z * 100)-lastZ;
	if (deltaX > 50 && carSpeed > -150 ) {
		carSpeed -= 150; 
	}
	if (deltaX < -50 && carSpeed < 150) {
		carSpeed += 150; 
	}
	//if (deltaY > 150) vitesse=350; 
	//$("#score").html("x: "+deltaX+", y:"+deltaY+", z:"+deltaZ);
	lastX = Math.round(a.x * 100);
	lastY = Math.round(a.y * 100);
	lastZ = Math.round(a.z * 100);
}

/**
 * startWatch() - initialisation de l'accelerometre
 */ 		
var watchID;
function startWatch() {
  var previousReading = {
    x: null,
    y: null,
    z: null
  }
  var options = { frequency: 250 };  // Update acceleration every quarter second
  watchID = navigator.accelerometer.watchAcceleration(updateAcceleration, function onError() {
    console.log('Some problem has occurred in reading the accelerometer.');
  }, options);
}
 
/**
 * stopWatch() - arret de l'accelerometre
 */  
function stopWatch() {
  if (watchID) {
    navigator.accelerometer.clearWatch(watchID);
    watchID = null;
  }
}
