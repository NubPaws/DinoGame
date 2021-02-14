
class Entity {
	
	x; y; width; height;
	dx = 0;
	dy = 0;
	
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	update() {
		this.x += this.dx;
		this.y += this.dy;
	}
	
	render() {
		Graphics.fillRect(this.x, this.y, this.width, this.height, Colors.green);
	}
	
	// Oh god
	intersects(e) {
		const tx = this.x,	ty = this.y,	tw = this.width,	th = this.height;
		const ex = e.x,		ey = e.y,		ew = e.width,		eh = e.height;
		return (ex <= tx		&& tx <= ex + ew		&& ey <= ty			&& ty <= ey + eh)
			|| (tx <= ex		&& ex <= tx + tw		&& ty <= ey			&& ey <= ty + th)
			|| (ex <= tx + tw	&& tx + tw <= e.x + ew	&& ey <= ty + th	&& ty + th <= e.y + eh)
			|| (tx <= ex + ew	&& ex + ew <= tx + tw	&& ty <= ey + eh	&& ey + eh <= ty + th);
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
	
	static get jumpingForce() { return 10; }
	worldIntersectionCheck;
	alive = true;
	moving = false;
	jumping = true;
	
	standingSprite = document.getElementById("playerStanding");
	runningAnimation = new SpriteAnimation("playerRunning", 8);
	
	constructor(worldIntersectionCheck) {
		super(25, Graphics.height -Physics.groundHeight -64*2, 28, 64);
		this.color = Colors.orange;
		this.worldIntersectionCheck = worldIntersectionCheck;
	}
	
	#jumpingLogic() {
		if (this.jumping) {
			this.dy += Physics.g * ((Keys.isPressed(Keys.Space)) ? .6 : 1);
			if (this.y +this.height >= Graphics.height -Physics.groundHeight) {
				this.dy = 0;
				this.jumping = false;
				this.y = Graphics.height - Physics.groundHeight - this.height -1;
			}
		}
	}
	
	#deathLogic() {
		if (this.worldIntersectionCheck(this)) {
			this.moving = false;
			this.alive = false;
			this.jumping = false;
			this.dx = this.dy = 0;
		}
	}
	
	update() {
		if (Keys.isClicked(Keys.Space) && !this.moving) {
			this.moving = true;
		}
		if (Keys.isPressed(Keys.Space) && !this.jumping) {
			this.jumping = true;
			this.dy = -Player.jumpingForce;
		}
		
		if (this.moving)
			this.runningAnimation.update();
		
		this.#jumpingLogic();
		this.#deathLogic();
		
		this.x += this.dx;
		this.y += this.dy;
		
	}
	
	render() {
		if (this.moving)
			Graphics.drawImage(this.runningAnimation.current, this.x, this.y, this.width, this.height)
		else Graphics.drawImage(this.standingSprite, this.x, this.y, this.width, this.height);
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
		this.y -= (Math.random() *120 +70);
	}
	
}
