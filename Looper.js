
/* Usage:
Call Looper.init(updateFunc, renderFunc) to start the game loop.
Make sure that you pass the proper logic and draw functions.
where UPDATE_RATE is the amount of update method calls a second.

The whole point of this class is to have a gameloop that is consistent,
60 updates/second, regardless of the frames/second.

How it works:
Every iteration we check how long has it been since the last iteration.
With basic algebra we know that the time that has passed in milliseconds
divided by our variable MILLIS_TO_UPDATES is the amount of logic updates
we need to do. So we just do that in a basic loop. Every time the function
is being called, which should depend on the highest refresh rate of the
monitors you have, we draw to the screen. So when debugging (setting the
debug flag to true) we can tell that the loop runs smoothly if we receive
that refresh rate in frames per second.
*/

class Looper {
	
	static #UPDATE_RATE = 60;
	static #MILLIS_TO_UPDATES = 1000.0 / Looper.#UPDATE_RATE;
	
	static #update;
	static #render;
	
	static #deltaTime = 0;
	static #lastTime = 0;
	static #nowTime;
	static #UPS = 0;
	static #FPS = 0;
	static #fpsTimer = 0;
	static #debug = false;
	
	static init(updateFunc, renderFunc) {
		Looper.#update = updateFunc;
		Looper.#render = renderFunc;
		window.requestAnimationFrame(Looper.loop);
	}
	
	// Where the magic happens.
	static loop(timestamp) {
		Looper.#nowTime = timestamp;
		Looper.#deltaTime += (Looper.#nowTime -Looper.#lastTime) /Looper.#MILLIS_TO_UPDATES;
		Looper.#lastTime = Looper.#nowTime;
		
		while (Looper.#deltaTime >= 1) {
			Looper.#update();
			Looper.#UPS++;
			Looper.#deltaTime--;
		}
		
		Looper.#render();
		Looper.#FPS++;
		
		if (timestamp -Looper.#fpsTimer > 1000) {
			Looper.#fpsTimer = timestamp;
			if (Looper.#debug)
				console.log(`fps: ${Looper.#FPS} | ups: ${Looper.#UPS}`);
			Looper.#FPS = Looper.#UPS = 0;
		}
		
		window.requestAnimationFrame(Looper.loop);
	}
	
	static get updateRate() { return Looper.#UPDATE_RATE; }
	static set debug(debug) { Looper.#debug = debug; }
	static get debug() { return Looper.debug; }
	static get currPartOfSecond() { return Looper.#UPS / Looper.#UPDATE_RATE; }
	static set updateRate(updateRate) {
		Looper.#UPDATE_RATE = updateRate;
		Looper.#MILLIS_TO_UPDATES = 1000.0 /Looper.#UPDATE_RATE;
	}
	
}
