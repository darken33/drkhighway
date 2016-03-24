var sound_loaded = 0;
var motor_snd = "/android_asset/www/sounds/motor.mp3";
var m_motor;
var motor2_snd = "/android_asset/www/sounds/motor.mp3";
var m_motor2;
var crash_snd = "/android_asset/www/sounds/crash.mp3";
var m_crash;
var horn_snd = "/android_asset/www/sounds/horn.mp3";
var m_horn;

function loopMotor(status) {
	if (status == Media.MEDIA_STOPPED && !gameEnded) {
		m_motor.play();
	}
}

function loopMotor2(status) {
	if (status == Media.MEDIA_STOPPED && !gameEnded) {
		m_motor2.play();
	}
}

function soundLoaded() {
	console.log('play sound.');
}

function isSoundReady() {
	return (sound_loaded == 4);
}

function soundErr(err) {
	alert(err);
}

function loadSounds() {
	if (isFirefoxOS()) {
		m_motor = document.getElementById("motor_snd");
		m_motor2 = document.getElementById("motor2_snd");
		m_crash = document.getElementById("crash_snd");
		m_horn = document.getElementById("horn_snd");
		sound_loaded = 4;
	}
	else {
		m_motor = new Media(motor_snd, soundLoaded, soundErr, loopMotor);
		m_motor2 = new Media(motor2_snd, soundLoaded, soundErr, loopMotor2);
		m_crash = new Media(crash_snd, soundLoaded, soundErr);
		m_horn = new Media(horn_snd, soundLoaded, soundErr);
		sound_loaded = 4;
	}
}
