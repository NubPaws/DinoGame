// Assumes update() and render() are valid functions
// Functions should be defined at dino.js

const UPDATE_RATE = 60;
const MILLIS_TO_UPDATES = 1000.0 / UPDATE_RATE;
let deltaTime = 0;
let lastTime = 0;
let nowTime;
let UPS = 0;
let FPS = 0;
let fpsTimer = 0;
let debug = false;

function loop(timestamp) {
	nowTime = timestamp;
	deltaTime += (nowTime -lastTime) /MILLIS_TO_UPDATES;
	lastTime = nowTime;
	
	while (deltaTime >= 1) {
		update();
		UPS++;
		deltaTime--;
	}
	
	render();
	FPS++;
	
	if (timestamp -fpsTimer > 1000) {
		fpsTimer = timestamp;
		if (debug)
			console.log(`fps: ${FPS} | ups: ${UPS}`);
		FPS = UPS = 0;
	}
	
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);