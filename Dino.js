const scoreText = document.getElementById("score");

// Initialized in init
let score;
let timer;
let player;

function init() {
	// Just reassign variables, yes there is some code duplication but what do you want from me?
	player = new Player(World.intersects);
	score = 0;
	baseSpeed = 5;
	timer = -1;
	World.init();
	scoreText.innerHTML = `Score: 0<br />Difficulty: 1`;
}

// Logic
function update() {
	if (Keys.isClicked(Keys.Enter))
		init(); // Basically a restart
	
	player.update();
	
	// Easter egg
	if (Keys.isClicked(Keys.G))
		World.addEnemy(3);
	
	if (player.moving) {
		score++;
		if (score %500 == 0)
			World.nextDifficulty();
		
		timer++;
		if (timer %100 == 0)
			World.addRandEnemy();
		World.update();
		
		scoreText.innerHTML = `Score: ${score}<br />Difficulty: ${World.difficulty}`;
	}
	
	Keys.update();
}

// Pretty colors
function render() {
	//  Scenery
	Graphics.fillRect(0, 0, Graphics.width, Graphics.height, Colors.lightBlue);
	
	World.render();
	
	player.render();
	
	if (!player.alive)
		GameOver.render();
}

Looper.init(update, render);
Keys.init();
Graphics.init("gameCanvas");
World.init();
init();
