// Assumes canvas, ctx, WIDTH, HEIGHT are all valid constants

// Initialize static classes
Graphics.init("gameCanvas");
Keys.init();

// Helper variables
const scoreText = document.getElementById("score");
let score = 0;
let difficulty = 1;
let baseSpeed = 5;
let timer = 0;
const GameOver = {
	img: document.getElementById("gameOver"),
	width: 610,
	height: 128,
	render: () => {
		Graphics.drawImage(GameOver.img,
			(Graphics.width - GameOver.width) /2,
			(Graphics.height - GameOver.height) /2,
			GameOver.width, GameOver.height
		);
	}
};

// Create the world
const world = {
	background: {
		ground: new Ground(Physics.groundHeight),
		clouds: document.getElementsByClassName("clouds"),
		cloudsX: 30, cloudsY: 15, cloudsWidth: 200, cloudsHeight: 98,
	},
	objs: [],
	
}
// Entity intersects with any object in the world, excluding the ground.
world.intersects = (e) => {
	for (let i = 0; i < world.objs.length; i++) {
		if (e.intersects(world.objs[i]))
			return true;
	}
	return false;
}

// Create the player
let player = new Player(world);

// Generates speed based on difficulty
const genSpeed = () => { return baseSpeed * difficulty; }

// Generates random enemy based on complex number analysis and Math.random(). 
const getRandEnemy = () => {
	let rand = Math.random() *300;
	if (0 <= rand && rand < 100)
		return new TallEnemy(genSpeed());
	else if (100 <= rand && rand < 200)
		return new ShortEnemy(genSpeed());
	else if (200 <= rand && rand <= 300)
		return new FlyingEnemy(genSpeed());
	else // Should not happen!
		return undefined;
}

// Restart
function restart() {
	// Just reassign variables, yes there is some code duplication but what do you want from me?
	player = new Player(world);
	score = 0;
	difficulty = 1;
	baseSpeed = 5;
	timer = 0;
	world.objs = [];
}

// Logic
function update() {
	if (Keys.isClicked(Keys.Enter))
		restart();
	
	player.update();
	
	if (player.moving) {
		score++;
		if (score %500 == 0)
			difficulty++;
		
		timer++;
		if (timer > 100) {
			timer = 0;
			world.objs.push(getRandEnemy());
		}
		
		for (let i = 0; i < world.objs.length; i++)
			world.objs[i].update();
		
	}
	
	Keys.update();
	
	scoreText.innerHTML = `Score: ${score}<br />Difficulty: ${difficulty}`;
}

// Pretty colors
function render() {
	//  Scenery
	Graphics.fillRect(0, 0, Graphics.width, Graphics.height, Colors.lightBlue);
	
	// Render clouds 
	for (let i = 0; i < world.background.clouds.length; i++) {
		Graphics.drawImage(world.background.clouds[i],
			world.background.cloudsX + i *(world.background.cloudsWidth +25),
			world.background.cloudsY,
			world.background.cloudsWidth,
			world.background.cloudsHeight
		);
	}
	// Render ground
	world.background.ground.render();
	
	for (let i = 0; i < world.objs.length; i++)
		world.objs[i].render();
	
	player.render();
	
	if (!player.alive)
		GameOver.render();
}
