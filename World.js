
class World {
	
	static #ground; // Initializedin init
	static #difficulty = 1;
	static #baseSpeed = 5;
	static #objs;
	static #bgTwin = 0.1;
	
	static #clouds = {
		imgs: Array.from(document.getElementsByClassName("clouds")),
		x: 30, y: 15, width: 200, height: 98, margin: 25
	};
	
	static genSpeed() {
		return World.#difficulty * World.#baseSpeed;
	}
	
	static init() {
		World.resetDifficulty();
		World.#objs = [];
		World.#ground = new Ground(Physics.groundHeight);
	}
	
	static #updateClouds() {
		const {x, y, width, height, imgs, margin} = World.#clouds;
		// If the first cloud is not visible, shuffle the images for continousness-ness
		if (!Graphics.isVisible(x, y, width, height)) {
			const tmpImgs = imgs;
			const len = imgs.length;
			for (let i = 0; i < len -1; i++)
				imgs[i] = tmpImgs[i +1];
			imgs[len -1] = tmpImgs[0];
			World.#clouds.x = margin;
		}
		World.#clouds.x -= World.genSpeed() *World.#bgTwin;
	}
	
	static update() {
		World.#updateClouds();
		
		for (let i = 0; i < World.#objs.length; i++)
			World.#objs[i].update();
	}
	
	static #renderClouds() {
		const {imgs, x, y, width, height, margin} = World.#clouds;
		for (let i = 0; i < imgs.length; i++)
			Graphics.drawImage(imgs[i], x + i *(width + margin), y, width, height);
	}
	
	static render() {
		World.#renderClouds();
		World.#ground.render();
		
		for (let i = 0; i < World.#objs.length; i++)
			World.#objs[i].render();
	}
	
	// Entity intersects with any object in the world, excluding the ground.
	static intersects(entity) {
		for (let i = 0; i < World.#objs.length; i++)
			if (entity.intersects(World.#objs[i]))
				return true;
		return false;
	}
	
	static addEntity(e) {
		World.#objs.push(e);
	}
	
	// 1 - TallEnemy, 2 - ShortEnemy, 3 - FlyingEnemy
	static addEnemy(type) {
		const speed = World.genSpeed();
		switch (type) {
			case 1: World.#objs.push(new TallEnemy(speed)); break;
			case 2: World.#objs.push(new ShortEnemy(speed)); break;
			case 3: World.#objs.push(new FlyingEnemy(speed)); break;
			default: break;
		}
	}
	
	static addRandEnemy() {
		const rand = Math.random() *300;
		const speed = World.genSpeed();
		if (0 <= rand && rand < 100)
			World.#objs.push(new TallEnemy(speed));
		else if (100 <= rand && rand < 200)
			World.#objs.push(new ShortEnemy(speed));
		else if (200 <= rand && rand <= 300)
			World.#objs.push(new FlyingEnemy(speed));
		else // Should not happen!
			return undefined;
	}
	
	static nextDifficulty() { World.#difficulty++; }
	static resetDifficulty() { World.#difficulty = 1; }
	static get difficulty() { return World.#difficulty; }
	
	static set baseSpeed(speed) { World.#baseSpeed = speed; }
	static get baseSpeed() { return World.#baseSpeed; }
	
}
