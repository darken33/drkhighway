/**
 * updateAcceleration() - Code pour l'accelerometer
 */ 			
function updateAcceleration(a) {
	ax = Math.round(a.x * 100);
//	$("#acc").html(ax);
	if ( ax > 50) {
		carSpeed = -1 * carSpeedMax
	}
	else if (ax < -50) {
		 carSpeed = carSpeedMax
	}
	else {
		 carSpeed = 0;
	}
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
  var options = { frequency: 25 };  // Update acceleration every quarter second
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
