const scorePanel = document.querySelector('.score');
const livesPanel = document.querySelector('.lives');
const welcomeScreen = document.querySelector('.modal-bc');
const timer = document.querySelector('.time');
const gemPosY = [105, 190];
const gemPosX = [20, 125, 225, 325];
const gemSprite = ['images/gem-orange.png', 'images/heart.png', 'images/selector.png'];

let player;
let allEnemies = [];
let allGems = [];

let oldScore = 0;
let minutes = 0;
let seconds = 0;
let timeCount;
let gameRunning = false;

// enemy class
class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
        this.speed = speed;
    }
// Updates the enemy's position, Parameter: dt, a time delta between ticks
    update(dt) {
      this.x += this.speed * dt;
      if (this.x > 505) {
        this.x = -200;
        this.y = this.enemyXPos();
      }
      this.checkCollisions();
    }
// checks bug's and player's positions if collided resets player
    checkCollisions() {
      if (player.y + 76 < this.y || player.y > this.y + 67 || player.x + 68 < this.x || (player.x + 20) > this.x + 100) {
        return;
        }
      else {
        player.x = 200;
        player.y = 320;
        player.livesDown();
        }
    }
// Randomly selects vertical position of the enemy between 230 and 60
    enemyXPos() {
      return Math.random() * (230 - 60) + 60;
    }
// Draw the enemy on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//collectables class
class Gem {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
// checks player and gem collition
    update(dt) {
      this.checkCollisions();
    }

    checkCollisions() {
    for (let i = 0; i < allGems.length; i++) {
      if ((player.y <= allGems[i].y && player.y >= allGems[i].y - 100) && (player.x <= allGems[i].x && player.x >= allGems[i].x - 83)) {
         collectGem(allGems[i]);
        }
      }
    }
// Draw the gem on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


// Player Class
class Player {
  constructor(x, y, sprite){
    this.y = y;
    this.x = x;
    this.sprite = sprite;
    this.scores = 0;
    this.lives = 3;
  }
//updates player movement, checks if target reached
  update() {
    if (this.y < -20) {
      this.win();
  }
}
// Draw the player on the screen
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
// Handles movement by key press
  handleInput(allowedKeys){
    switch (allowedKeys) {
      case 'up':
        if (this.y === 65 && this.y <= -20) {
          this.y -= 42;
        }
        else {
          this.y -= 85;
        }
      break;
      case 'down':
        if (this.y < 400) {
          this.y += 85;
          console.log('allowedKeys')
        }
        break;
      case 'left':
        if (this.x > 0) {
          this.x -= 100;
        }
        break;
      case 'right':
        if (this.x < 400) {
          this.x += 100;
        }
        break;
    }
  }
//resets player after gameover
  resetPlayer() {
    //restore default player values
    this.x = 200;
    this.y = 320;
    this.scores = 0;
    this.lives = 3;
    //reset time values
    minutes = 0;
    seconds = 0;
    //reset score panel
    livesPanel.innerHTML = '';
    scorePanel.innerHTML = 'Score: 0';
    timer.innerHTML = 'Time: 00 : 00';

    for (let i = 0; i < 3; i++) {
     livesPanel.innerHTML += '<li><img src="images/Heart.png"></li>';
    };

    createEnemy();
 }
 // changes score in panel, resets position and creates new gems
  win(){
    checkPoints();
    scorePanel.innerText = `Score: ${this.scores}`;
    this.y = 320;
    allGems = [];
    createGem();
  }
// if collided with enemie removes one heart, if hearts = 0, restets game
  livesDown(){
    this.lives--;
      if (this.lives === 0){
        livesPanel.removeChild(livesPanel.children[0]);
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.innerHTML = '<div class="modal game-over"><h1>Game Over</h1><p>Press Down: &#8595; To Restart<p></div>';
        allEnemies = [];
        stopTimer();
        gameRunning = false;
        this.resetPlayer();
      }
      else if (this.lives > 0 && this.lives < 4){
        livesPanel.removeChild(livesPanel.children[0]);
      }
    }

}

// ed of enemy, gem and player classes


// GAME TIMER FUNCTIONS
// count time
function startTimer() {
  timeCount = setInterval(function(){
    seconds++;
    if(seconds === 60) {
      seconds = 0;
      minutes++;
      if (minutes === 60) {
        minutes = 0;
        stopTimer();
      }
    }

    timer.innerHTML = format();

  }, 1000);
}
// format displayed for score panel
function format(){
  let sec = seconds > 9 ? String(seconds) : '0' + String(seconds);
  let min = minutes > 9 ? String(minutes) : '0' + String(minutes);
  return `Time: ${min} : ${sec}`;
}
// stop timer
function stopTimer(){
  clearInterval(timeCount);
}


function checkPoints(){
  if (player.scores - oldScore >= 250) {
    createEnemy();
    oldScore = player.scores;
  }
  player.scores += 10;
}
// Create enemies, player and gems for a game
player = new Player(200, 320, 'images/char-boy.png');
// first run adds 3 enemies, later, eeach time player collects points, adds one more enemy
// function createEnemy(){
//   if (gameRunning) {
//     let enemy = new Enemy(-15, 220,  100 + Math.floor(Math.random() * 510));
//     allEnemies.push(enemy);
//   }
//   else {
//     let enemy = new Enemy(-15, 220,  80 + Math.floor(Math.random() * 420));
//     let enemy1 = new Enemy(-115, 220, 80 + Math.floor(Math.random() * 400));
//     let enemy2 = new Enemy(-115, 220, 80 + Math.floor(Math.random() * 250));
//     allEnemies.push(enemy);
//     allEnemies.push(enemy1)
//     allEnemies.push(enemy2);
//   }
// }
function createEnemy(){
  let enemy = new Enemy(-15, 220,  100 + Math.floor(Math.random() * 350));
  allEnemies.push(enemy);
}

//create custom gem
function createGem(){
  let y;
  let x;
  let sprite;

  for (let i = 0; i < 3; i++) {
    y = gemPosY[Math.floor(Math.random() * gemPosY.length)];
    x = gemPosX[Math.floor(Math.random() * gemPosX.length)];
    sprite = gemSprite[Math.floor(Math.random() * gemSprite.length)];

    let gem = new Gem(x, y, sprite);
    allGems.push(gem);
  }
}

createGem();
createEnemy();
//display hearts on first load
for (let i = 0; i < 3; i++) {
 livesPanel.innerHTML += '<li><img src="images/Heart.png"></li>';
};

/*collect gem
* if HEART and lives is < 3, adds one life, else adds 20points to score panel.
* if ORANGE GEM add 50points
* if SELECTOR brings player to water
*/
function collectGem(item){
  if(item.sprite === 'images/gem-orange.png'){
    player.scores += 50;
    scorePanel.innerText = `Score: ${player.scores}`;
  }
  else if(item.sprite === 'images/heart.png') {
    if (player.lives < 3){
      livesPanel.innerHTML += '<li><img src="images/Heart.png"/></li>';
      player.lives++;
    }
    else {
      player.scores += 20;
      scorePanel.innerText = `Score: ${player.scores}`;
    }
  }
  else if (item.sprite === 'images/selector.png') {
    player.y = -20
  }
  item.x = -200;
}

function flowControl(allowedKeys) {
  if (allowedKeys && !gameRunning){
    welcomeScreen.classList.add('hidden');
    startTimer();
    gameRunning = true;
}
}



document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    flowControl(allowedKeys[e.keyCode]);

});
