// Enemies our player must avoid
let player;
let enemy;
let lives = [];

class Enemy {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
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
    this.score = 0;
    this.lives = 3;
  }
  update() {

  }
  // Draw the enemy on the screen
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // Handles the movement
  handleInput(allowedKeys){
    switch (allowedKeys) {
      case 'up':
        if (this.y > -20) {
          this.y -= 85;
        };
        break;
      case 'down':
        if (this.y < 400) {
          this.y += 85;
        };
        break;
      case 'left':
        if (this.x > 0) {
          this.x -= 100;
        };
        break;
      case 'right':
        if (this.x < 400) {
          this.x += 100;
        };
        break;
    }

  }
  resetPlayer(){
    this.x = 200;
    this.y = 320;
    this.score = 0;
    this.lives = 3;
  }
}

// instantiated objects - bug and player

allEnemies = [];
player = new Player(200, 320, 'images/char-boy.png');

enemy = new Enemy(0, 230, 5);
allEnemies.push(enemy);


// This function listens for key presses

document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
