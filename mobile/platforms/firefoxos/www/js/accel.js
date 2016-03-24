/**
 * updateAcceleration() - Code pour l'accelerometer
 */ 			
// Position de départ
var initialReading = {
    x: null,
    y: null,
    z: null
}
var mult = 150;
/**
 * updateAcceleration() 
 */ 			
function updateAcceleration(a) {
	
	if (initialReading.x == null) {
		initialReading.x = a.x;
		initialReading.y = a.y;
		initialReading.z = a.z;
	}
	// Calculer le déplacement sur x et y
	carSpeed = (Math.round((a.x - initialReading.x) *mult) * -1);
}

/**
 * startWatch() - initialisation de l'accelerometre
 */ 		
var watchID;
function startWatch() {
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
	initialReading.x = null;
	initialReading.y = null;
	initialReading.z = null;
    navigator.accelerometer.clearWatch(watchID);
    watchID = null;
  }
}
