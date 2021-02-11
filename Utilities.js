

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
		this.#ctx.beginPath();
		this.#ctx.rect(x, y, width, height);
		this.#ctx.fillStyle = color;
		this.#ctx.fill();
	}
	
	static drawRect(x, y, width, height, color, stroke = -1) {
		this.#ctx.beginPath();
		this.#ctx.rect(x, y, width, height);
		this.#ctx.strokeStyle = color;
		if (stroke > -1)
			this.#ctx.lineWidth = `${stroke}`;
		this.#ctx.stroke();
	}
	
	static drawImage(img, x, y, width, height) {
		this.#ctx.drawImage(img, x, y, width, height);
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

class Physics {
	
	static get g() { return .8; }
	static get groundHeight() { return 100; }
	
}
