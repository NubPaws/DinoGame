


class Entity {
	
	x; y; width; height;
	dx = 0;
	dy = 0;
	color;
	
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
	
	update() {
		this.x += this.dx;
		this.y += this.dy;
	}
	
	render() {
		Graphics.fillRect(this.x, this.y, this.width, this.height, this.color);
	}
	
	intersects(e) {
		return (e.x <= this.x && this.x <= e.x + e.width
			&&  e.y <= this.y && this.y <= e.y + e.height)
			|| (this.x <= e.x && e.x <= this.x + this.width
			&&  this.y <= e.y && e.y <= this.y + this.height)
			|| (e.x <= this.x + this.width && this.x + this.width <= e.x + e.width
			&&  e.y <= this.y + this.height && this.y + this.height <= e.y + e.height)
			|| (this.x <= e.x + e.width && e.x + e.width <= this.x + this.width
			&&  this.y <= e.y + e.height && e.y + e.height <= this.y + this.height);
	}
	
}

class Ground extends Entity {
	
	#upperGroundColor = Colors.green;
	#color = Colors.brown;
	
	constructor(height) {
		super(0, Graphics.height -height, Graphics.width, height);
	}
	
	render() {
		Graphics.fillRect(this.x, this.y, this.width, this.height, this.#color);
		Graphics.fillRect(this.x, this.y, this.width, this.height *.125, this.#upperGroundColor);
	}
	
}

class Player extends Entity {
	
	world;
	alive = true;
	moving = false;
	jumping = true;
	
	sprites = {
		standing: document.getElementById("playerStanding"),
		running: document.getElementsByClassName("playerRunning"),
		runningID: 0, runningCounter: 0, runningCounterMax: 8
	};
	
	constructor(world) {
		super(25, Graphics.height -Physics.groundHeight -64*2, 28, 64);
		this.color = Colors.orange;
		this.world = world;
	}
	
	update() {
		if (Keys.isClicked(Keys.Space) && !this.moving) {
			this.moving = true;
		}
		if (Keys.isPressed(Keys.Space) && !this.jumping) {
			this.jumping = true;
			this.dy = -13.5;
		}
		
		this.sprites.runningCounter++;
		if (this.sprites.runningCounter >= this.sprites.runningCounterMax) {
			this.sprites.runningCounter = 0;
			this.sprites.runningID++;
			if (this.sprites.runningID >= this.sprites.running.length)
				this.sprites.runningID = 0;
		}
		
		if (this.jumping) {
			this.dy += Physics.g * ((Keys.isPressed(Keys.Space)) ? .75 : 1.2);
			if (this.intersects(this.world.background.ground)) {
				this.dy = 0;
				this.jumping = false;
				this.y = Graphics.height - Physics.groundHeight - this.height -1;
			}
		}
		
		if (this.world.intersects(this)) {
			this.moving = false;
			this.alive = false;
			this.jumping = false;
			this.dx = this.dy = 0;
		}
		
		this.x += this.dx;
		this.y += this.dy;
		
	}
	
	render() {
		if (this.moving) {
			Graphics.drawImage(this.sprites.running[this.sprites.runningID], this.x, this.y, this.width, this.height)
		} else {
			Graphics.drawImage(this.sprites.standing, this.x, this.y, this.width, this.height);
		}
	}
	
}

class Enemy extends Entity {
	
	img;
	
	constructor(width, height, img, speed) {
		super(Graphics.width, Graphics.height -Physics.groundHeight -height, width, height);
		this.img = img;
		this.color = Colors.pink;
		this.dx = -speed;
	}
	
	render() {
		if (this.img == undefined)
			Graphics.fillRect(this.x, this.y, this.width, this.height, this.color);
		else
			Graphics.drawImage(this.img, this.x, this.y, this.width, this.height);
	}
	
}

class TallEnemy extends Enemy {
	
	static img = document.getElementById("tallEnenmy");
	
	constructor(speed) {
		super(32, 64, TallEnemy.img, speed);
	}
	
}

class ShortEnemy extends Enemy {
	
	static img = document.getElementById("shortEnemy");
	
	constructor(speed) {
		super(48, 32, ShortEnemy.img, speed);
	}
	
}

class FlyingEnemy extends Enemy {
	
	static img = document.getElementById("flyingEnemy");
	
	constructor(speed) {
		super(32, 24, FlyingEnemy.img, speed);
		this.y -= (Math.random() *30 +65);
	}
	
}
