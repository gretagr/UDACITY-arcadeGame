const scorePanel = document.querySelector('.score');
const livesPanel = document.querySelector('.lives');
const welcomeScreen = document.querySelector('.modal-bc');
const timer = document.querySelector('.time');

let player;
let enemy;
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

// Player Class

class Player {
  constructor(x, y, sprite){
    this.y = y;
    this.x = x;
    this.sprite = sprite;
    this.scores = 0;
    this.lives = 3;
  }

//updates player movement, checks if not colided and if target reached
  update() {
    this.coalition();
    if (this.y < -20) {
      this.win();
  }
}
  // Draw the player on the screen
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  // Handles the movement with keyboard

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

  // checks bug's and player's positions

  coalition() {
}
//resets player after gameover

  resetPlayer() {
    this.x = 200;
    this.y = 320;
    this.scores = 0;
    this.lives = 3;
    minutes = 0;
    seconds = 0;
    livesPanel.innerHTML = '';
    scorePanel.innerHTML = 'Score: 0';
    timer.innerHTML = 'Time: 00 : 00';
    for (let i = 0; i < 3; i++) {
     livesPanel.innerHTML += '<li><img src="images/Heart.png"></li>';
    };
    flowControl();
 }

// changes score in panel, resets position and creates new enemies
  win(){
    this.scores += 10;
    scorePanel.innerText = `Score: ${this.scores}`;
    this.y = 320;
    createEnemy();
  }

  livesDown(){
    this.lives--;
      if (this.lives === 0){
        livesPanel.removeChild(livesPanel.children[0]);
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.innerHTML = '<div class="modal game-over"><h1>Game Over</h1><p>Press Any Key To Restart<p></div>';
        stopTimer();
        gameRunning = false;
        this.resetPlayer();
      }
      else if (this.lives > 0 && this.lives < 4){
        livesPanel.removeChild(livesPanel.children[0]);
      }
    }

}

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

function format(){
  let sec = seconds > 9 ? String(seconds) : '0' + String(seconds);
  let min = minutes > 9 ? String(minutes) : '0' + String(minutes);
  return `Time: ${min} : ${sec}`;
}
function stopTimer(){
  clearInterval(timeCount);
}
// This function listens for key presses
allEnemies = [];

player = new Player(200, 320, 'images/char-boy.png');
enemy = new Enemy(0, 230, Math.random() * (300 - 150) + 150);
enemy1 = new Enemy(0, 230, Math.random() * (300 - 150) + 150);
allEnemies.push(enemy);
allEnemies.push(enemy1);
function createEnemy(){

}



for (let i = 0; i < 3; i++) {
 livesPanel.innerHTML += '<li><img src="images/Heart.png"></li>';
};

function flowControl(allowedKeys) {
  if (allowedKeys && !gameRunning){
    console.log(allowedKeys)
    welcomeScreen.classList.add('hidden');
    startTimer();
    gameRunning = true;
}
}
document.addEventListener('keyup', e => {
    const allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    flowControl(allowedKeys[e.keyCode]);

});
