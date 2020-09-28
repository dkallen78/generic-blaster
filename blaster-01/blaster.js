function makeElement(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an HTML element                             //
  //string-> type: type of element to be returned       //
  //string-> id: id of the element                      //
  //string-> classes: classes to add to the element     //
  //return-> element: element that was made             //
  //----------------------------------------------------//

  let element = document.createElement(type);
  if (typeof id === "string") {element.id = id}
  classes.forEach(x => element.classList.add(x));
  return element;
}

function rnd (floor, ceiling) {
  //----------------------------------------------------//
  //Gets a random number within a range of numbers      //
  //integer-> floor: lower bound of the random number   //
  //integer-> ceiling: upper bound of the random number //
  //return-> integer: random number between [floor]     //
  //  and [ceiling]                                     //
  //----------------------------------------------------//

  let range = (ceiling - floor) + 1;
  return Math.floor((Math.random() * range) + floor);
}

class Sprite {
  //----------------------------------------------------//
  //A data structure for holding information about      //
  //  sprites in relation to their position on the      //
  //  sprite sheet                                      //
  //----------------------------------------------------//

  constructor(x, y, w, h) {
    //--------------------------------------------------//
    //integer-> x, y: the top left corner of the sprite //
    //  on the sprite sheet                             //
    //integer-> w, h: the height and width of the sprite//
    //--------------------------------------------------//

    this._x = x;
    this._y = y;
    this._h = h;
    this._w = w;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get h() {
    return this._h;
  }

  get w() {
    return this._w;
  }
}

class Player {
  //----------------------------------------------------//
  //A data structure for holding information and methods//
  //  about the player's ship                           //
  //----------------------------------------------------//

  constructor(originX = 0, originY = 0, sprites) {
    //--------------------------------------------------//
    //integer-> originX, originY: initial position of   //
    //  the player's ship                               //
    //array(Sprite)-> sprites: the sprites used in the  //
    //  default animation of the ship                   //
    //--------------------------------------------------//
    //integer-> _w,_h: height and width of the ship     //
    //integer-> _sprite: index of the sprite in the     //
    //  [_sprites] array to use                         //
    //array-> _colliders: array of items to check for   //
    //  collisions                                      //
    //array(Sprite)-> _death: sprites to use for the    //
    //  death animation                                 //
    //--------------------------------------------------//

    this._x = originX;
    this._y = originY;
    this._w = sprites[0].w;
    this._h = sprites[0].h;
    this._sprites = sprites;
    this._sprite = 0;
    this._colliders = [];
    this._death = [];
    this._dead = false;
  }

  set x(change) {
    this._x = change;
  }

  get x() {
    return this._x;
  }

  set y(change) {
    this._y = change;
  }

  get y() {
    return this._y;
  }

  get w() {
    return this._w;
  }

  get h() {
    return this._h;
  }

  get sprite() {
    return this._sprite;
  }

  set sprite(num) {
    this._sprite = num;
  }

  get sprites() {
    return this._sprites;
  }

  set sprites(array) {
    this._sprites = array;
  }

  get colliders() {
    return this._colliders;
  }

  get death() {
    return this._death;
  }

  set death(array) {
    this._death = array;
  }

  get dead() {
    return this._dead;
  }

  set dead(change) {
    this._dead = change;
  }

  addCollider(array) {
    //--------------------------------------------------//
    //Adds an array of colliders to the ships collision //
    //  detectors                                       //
    //array-> array: the array of items to check against//
    //  for collisions                                  //
    //--------------------------------------------------//

    this._colliders.push(array);
  }

  sprt(num) {
    return this.sprites[num % this.sprites.length];
  }

  collide() {
    //--------------------------------------------------//
    //Checks the [this.colliders] array to see if a     //
    //  collision has occurred                          //
    //return-> boolean: true for collision              //
    //--------------------------------------------------//

    let self = this.sprt(0);

    for (let i = 0; i < this.colliders.length; i++) {
      for (let j = 0; j < this.colliders[i].length; j++) {
        if (this.x < this.colliders[i][j].x + this.colliders[i][j].w &&
            this.x + self.w > this.colliders[i][j].x &&
            this.y < this.colliders[i][j].y + this.colliders[i][j].h &&
            this.y + self.h > this.colliders[i][j].y) {
              //console.log(this.x, self.w, this.y, self.h);
              //console.log(this.colliders[i][j]);
              return true;
            }
      }
    }
    return false;
  }

  update(x, y) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //integer-> x, y: the position at which to draw the //
    //  ship                                            //
    //--------------------------------------------------//

    if (this.collide(shots) && !this.dead) {
      this.die();
    }
    if (this.dead && this.sprite >= this.sprites.length) {
      //enemies.splice(i, 1);
    } else {
      this.draw(x, y);
    }

  }

  draw(x, y) {
    //--------------------------------------------------//
    //Draws the ship on the screen                      //
    //integer-> x, y: Where to draw the ship            //
    //--------------------------------------------------//

    let img = this.sprt(this.sprite);
    ctx.drawImage(blastSheet, img.x, img.y, img.w, img.h, x, y, img.w, img.h);
  }

  move(x, y) {
    //--------------------------------------------------//
    //Updates the ship's position and prevents it from  //
    //  leaving the bounds of the <canvas>              //
    //integer-> x, y: How much to change the position   //
    //  of the ship                                     //
    //--------------------------------------------------//

    if (this.x + x < canvasWidth - 32
      && this.x + x > 0) {
        this.x = this.x + x;
    }
    if (this.y + y < canvasHeight - 32
      && this.y + y > 0) {
        this.y = this.y + y;
    }
  }

  die() {
    this.dead = true;
    this.sprites = this.death;
    this.sprite = 0;
  }
}

class Enemy extends Player {
  //----------------------------------------------------//
  //A data structure for the enemy ships. Identical to  //
  //  the Player class for now                          //
  //----------------------------------------------------//

  constructor(originX, originY, sprites) {
    super(originX, originY, sprites);
  }

  update(x, y, i, c) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //integer-> x, y: the position at which to draw the //
    //  ship                                            //
    //integer-> i: enemy's index in the enemy array     //
    //integer-> c: current frame count                  //
    //--------------------------------------------------//
    //
    //If there is a collision and it's not dead, kill it
    if (this.collide(shots) && !this.dead) {
      this.die();
    }
    //
    //If it's dead and animated, remove it,
    //  otherwise draw it.
    if (this.dead && this.sprite >= this.sprites.length) {
      enemies.splice(i, 1);
    } else {
      let newX;
      if (c % 100 >= 50) {
        newX = -8;
      } else {
        newX = 8;
      }
      this.move(newX, 0);
      this.draw(x, y);
    }
  }
}

class Shot {
  //----------------------------------------------------//
  //A data structure for holding information about      //
  //  the shots fired by the player                     //
  //----------------------------------------------------//

  constructor(originX = player.x, originY = player.y) {
    //--------------------------------------------------//
    //integer-> originX, originY: where to first place  //
    //  the shot sprite                                 //
    //--------------------------------------------------//
    //integer-> _w, _h: width and height of the sprite  //
    //--------------------------------------------------//

    this._x = originX;
    this._y = originY;
    this._w = flyingShot.w;
    this._h = flyingShot.h;
  }

  set x(change) {
    this._x = change;
  }

  get x() {
    return this._x;
  }

  set y(change) {
    this._y = change;
  }

  get y() {
    return this._y;
  }

  get w() {
    return this._w;
  }

  get h() {
    return this._h;
  }

  draw() {
    //--------------------------------------------------//
    //Draws the sprite, advancing it 16 pixesls for     //
    //  each frame                                      //
    //--------------------------------------------------//

    this.y = this.y - 16;
    ctx.drawImage(blastSheet, flyingShot.x, flyingShot.y, flyingShot.w, flyingShot.h, this.x, this.y, this.w, this.h);
  }

}

class KeyState {
  //----------------------------------------------------//
  //A data structure for holding information about      //
  //  which keys have been pressed                      //
  //----------------------------------------------------//

  constructor() {
    //----------------------------------------------------//
    //boolean-> _all: the state of each key press         //
    //----------------------------------------------------//

    this._left = false;
    this._right = false;
    this._up = false;
    this._down = false;
    this._space = false;
  }

  get left() {
    return this._left;
  }

  set left(state) {
    this._left = state;
  }

  get right() {
    return this._right;
  }

  set right(state) {
    this._right = state;
  }

  get up() {
    return this._up;
  }

  set up(state) {
    this._up = state;
  }

  get down() {
    return this._down;
  }

  set down(state) {
    this._down = state;
  }

  get space() {
    return this._space;
  }

  set space(state) {
    this._space = state;
  }

  update() {
    //--------------------------------------------------//
    //What to do if a particular key has been pressed   //
    //--------------------------------------------------//

    if (this.left) player.move(-8, 0);
    if (this.right) player.move(8, 0);
    if (this.up) player.move(0, -8);
    if (this.down) player.move(0, 8);
    if (this.space) isShot = true;
  }
}
let keyState = new KeyState;

document.onkeydown = function(event) {
  //----------------------------------------------------//
  //Listens for a key to be pressed down                //
  //event-> event: the key down event                   //
  //----------------------------------------------------//

  //console.log("press");
  if (event.code === "ArrowUp") keyState.up = true;
  if (event.code === "ArrowDown") keyState.down = true;
  if (event.code === "ArrowLeft") keyState.left = true;
  if (event.code === "ArrowRight") keyState.right = true;
  if (event.code === "Space" ) keyState.space = true;
}

document.onkeyup = function(event) {
  //----------------------------------------------------//
  //Listens for a key to be released                    //
  //event-> event: the keyboard event                   //
  //----------------------------------------------------//

  //console.log("press");
  if (event.code === "ArrowUp") keyState.up = false;
  if (event.code === "ArrowDown") keyState.down = false;
  if (event.code === "ArrowLeft") keyState.left = false;
  if (event.code === "ArrowRight") keyState.right = false;
  if (event.code === "Space" ) keyState.space = false;
}
//
//Making the <canvas> element and placing it in
//  the body
let gameCanvas = makeElement("canvas", "gameCanvas");
document.body.appendChild(gameCanvas);
const canvasHeight = 480;
const canvasWidth = 720;
gameCanvas.setAttribute("height", canvasHeight);
gameCanvas.setAttribute("width", canvasWidth);
//
//Setting the context
let ctx = gameCanvas.getContext("2d");
//
//Loading the sprite sheet
let blastSheet = new Image();
blastSheet.src = "blastSheet.png";

let ship1 = new Sprite(0, 5, 32, 27);
let ship2 = new Sprite(32, 5, 32, 27);
let ship3 = new Sprite(64, 5, 32, 27);

let player = new Player(320, 320, [ship1, ship2, ship3]);

let enemy1 = new Sprite(0, 32, 32, 32);
let enemy2 = new Sprite(32, 32, 32, 32);
let enemy3 = new Sprite(0, 32, 32, 32);
let enemy4 = new Sprite(64, 32, 32, 32);

let enemyDeath1 = new Sprite(0, 64, 32, 32);
let enemyDeath2 = new Sprite(32, 64, 32, 32);
let enemyDeath3 = new Sprite(64, 64, 32, 32);
let enemyDeath4 = new Sprite(96, 64, 32, 32);

let enemy = new Enemy(32, 32, [enemy1, enemy2, enemy3, enemy4]);
enemy.death = [enemyDeath1, enemyDeath2, enemyDeath3, enemyDeath4];
let enemyNum2 = new Enemy(600, 32, [enemy1, enemy2, enemy3, enemy4]);
enemyNum2.death = [enemyDeath1, enemyDeath2, enemyDeath3, enemyDeath4];
let enemies = [];
enemies.push(enemy, enemyNum2);

player.addCollider(enemies);

let shot1 = new Sprite(0, 0, 32, 5);
let shot2 = new Sprite(32, 0, 32, 5);
let shot3 = new Sprite(64, 0, 32, 5);

let flyingShot = new Sprite(96, 0, 32, 10);

let isShot = false;

let shotPng = shot1;

let shots = [];

enemy.addCollider(shots);
enemyNum2.addCollider(shots);

let kill = [];

let loopCount = 0;
let gameLoop = setInterval(function() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  keyState.update();

  if (loopCount % 2 === 0) {
    enemy.sprite++;
    enemyNum2.sprite++;
  }

  if (loopCount % 2 === 0) {
    player.sprite++;
  }

  player.update(player.x, player.y);
  enemies.forEach((x, i) => x.update(x.x, x.y, i, loopCount));

  shots.forEach(function(x) {
    if (x.y < 0) {
      shots.shift();
    } else {
      x.draw();
    }
  });

  if (isShot) {

    ctx.drawImage(blastSheet, shotPng.x, shotPng.y, shotPng.w, shotPng.h, player.x, player.y - 5, shotPng.w, shotPng.h);
    if (shotPng === shot1) {
      shotPng = shot2;
    } else if (shotPng === shot2) {
      shotPng = shot3
    } else {
      isShot = false;
      shotPng = shot1;
      let shotX = new Shot();
      shots.push(shotX);
    }
  }

  loopCount++;
  /*if (loopCount > 10) {
    clearInterval(gameLoop);
  }*/
}, 40);
