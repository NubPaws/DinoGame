
class Graphics {
	
	static #canvas;
	static #ctx;
	static #width;
	static #height;
	
	static get canvas() { return Graphics.#canvas; }
	static get ctx() { return Graphics.#ctx; }
	static get width() { return Graphics.#width; }
	static get height() { return Graphics.#height; }
	
	static init(canvObjName) {
		Graphics.#canvas = document.getElementById(canvObjName);
		Graphics.#ctx = Graphics.#canvas.getContext("2d");
		Graphics.#width = Graphics.#canvas.width;
		Graphics.#height = Graphics.#canvas.height;
	}
	
	static fillRect(x, y, width, height, color) {
		Graphics.#ctx.beginPath();
		Graphics.#ctx.rect(x, y, width, height);
		Graphics.#ctx.fillStyle = color;
		Graphics.#ctx.fill();
	}
	
	static drawRect(x, y, width, height, color, stroke = -1) {
		Graphics.#ctx.beginPath();
		Graphics.#ctx.rect(x, y, width, height);
		Graphics.#ctx.strokeStyle = color;
		if (stroke > -1)
			Graphics.#ctx.lineWidth = `${stroke}`;
		Graphics.#ctx.stroke();
	}
	
	static drawImage(img, x, y, width, height) {
		Graphics.#ctx.drawImage(img, x, y, width, height);
	}
	
	static isVisible(x, y, width, height) {
		return ((0 <= x			&& x			<= Graphics.width)
			||  (0 <= x +width	&& x +width		<= Graphics.width))
			&& ((0 <= y			&& y			<= Graphics.height)
			||  (0 <= y +height	&& y +height	<= Graphics.height));
	}
	
}

class Keys {
	
	static #numOfKeys = 16;
	static #keys = new Array(Keys.#numOfKeys).fill(false);
	static #prevKeys = new Array(Keys.#numOfKeys).fill(false);
	
	static get W() { return 0; }
	static get S() { return 1; }
	static get A() { return 2; }
	static get D() { return 3; }
	static get Space() { return 4; }
	static get Enter() { return 5; }
	static get Ctrl() { return 6; }
	static get Esc() { return 7; }
	static get G() { return 8; }
	
	static isPressed(key) { return Keys.#keys[key]; }
	static isClicked(key) { return Keys.#keys[key] && !Keys.#prevKeys[key]; }
	
	static update() {
		for (let i = 0; i < Keys.#numOfKeys; i++)
			Keys.#prevKeys[i] = Keys.#keys[i];
	}
	
	static #setKey(key, val) { Keys.#keys[key] = val; }
	
	static #listener(event) {
		let keyToSet = -1;
		switch (event.keyCode) {
			case 87: keyToSet = Keys.W;		break;
			case 65: keyToSet = Keys.A;		break;
			case 83: keyToSet = Keys.S;		break;
			case 68: keyToSet = Keys.D;		break;
			case 71: keyToSet = Keys.G;		break;
			case 32: keyToSet = Keys.Space;	break;
			case 16: keyToSet = Keys.Shift;	break;
			case 17: keyToSet = Keys.Ctrl;	break;
			case 13: keyToSet = Keys.Enter;	break;
		}
		if (keyToSet > -1) {
			if (event.type == "keydown")
				Keys.#setKey(keyToSet, true);
			if (event.type == "keyup")
				Keys.#setKey(keyToSet, false);
		}
	}
	
	static init() {
		document.addEventListener("keydown", Keys.#listener);
		document.addEventListener("keyup", Keys.#listener);
	}
	
}

class Colors {
	
	static get black()		{ return "#FFFFFF"; }
	static get white()		{ return "#000000"; }
	static get red()		{ return "#8C001A"; }
	static get green()		{ return "#7FB800"; }
	static get blue()		{ return "#0D2C54"; }
	static get lightBlue()	{ return "#00A6ED"; }
	static get darkBlue()	{ return "#001D4A"; }
	static get cyan()		{ return "#1DD3B0"; }
	static get orange()		{ return "#ECA400"; }
	static get purple()		{ return "#340068"; }
	static get pink()		{ return "#ED254E"; }
	static get grey()		{ return "#465362"; }
	static get brown()		{ return "#5C4033"; }
	
}

class GameOver {
	
	static #img = document.getElementById("gameOver");
	static #width = 610;
	static #height = 128;
	
	static render() {
		Graphics.drawImage(GameOver.#img,
			(Graphics.width - GameOver.#width) /2,
			(Graphics.height - GameOver.#height) /2,
			GameOver.#width, GameOver.#height
		);
	}
	
}

class Physics {
	
	static get g() { return .68; }
	static get groundHeight() { return 100; }
	
}

class SpriteAnimation {
	
	#imgs;
	#current;
	#tickCount;
	#ticksPerImg;
	
	constructor(imgsClassName, ticksPerImg) {
		this.#imgs = Array.from(document.getElementsByClassName(imgsClassName));
		this.#ticksPerImg = ticksPerImg;
		this.#current = 0;
		this.#tickCount = 0;
	}
	
	update() {
		this.#tickCount++;
		if (this.#tickCount >= this.#ticksPerImg) {
			this.#tickCount = 0;
			this.next();
		}
	}
	
	next(amount = 1) {
		this.#current += amount;
		if (this.#current >= this.#imgs.length)
			this.#current = 0;
	}
	
	prev(amount = 1) {
		this.#current -= amount;
		if (this.#current < 0)
			this.#current = this.#imgs.length -1;
	}
	
	get current() { return this.#imgs[this.#current]; }
	get imgs() { return this.#imgs; }
	set ticksPerImage(tpi) { this.#ticksPerImg = tpi; }
	
}
