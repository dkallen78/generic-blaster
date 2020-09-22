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
  constructor(x, y, w, h) {
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
  constructor(originX = 0, originY = 0, sprites) {
    this._x = originX;
    this._y = originY;
    this._sprites = sprites;
    this._sprite = 0;
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

  get sprite() {
    return this._sprite;
  }

  set sprite(num) {
    this._sprite = num;
  }

  get sprites() {
    return this._sprites;
  }

  sprt(num) {
    return this.sprites[num % this.sprites.length];
  }

  draw(x, y) {
    let img = this.sprt(this.sprite);
    ctx.drawImage(blastSheet, img.x, img.y, img.w, img.h, x, y, img.w, img.h);
  }

  move(x, y) {
    if (this.x + x < canvasWidth - 32
      && this.x + x > 0) {
        this.x = this.x + x;
    }
    if (this.y + y < canvasHeight - 32
      && this.y + y > 0) {
        this.y = this.y + y;
    }
  }
}

class Enemy extends Player {
  constructor(originX, originY, sprites) {
    super(originX, originY, sprites);
  }
}

class Shot {
  constructor(originX = player.x, originY = player.y + 8) {
    this._x = originX;
    this._y = originY;
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

  draw() {
    this.y = this.y - 16;
    ctx.drawImage(blastSheet, flyingShot.x, flyingShot.y, flyingShot.w, flyingShot.h, this.x, this.y, flyingShot.w, flyingShot.h);
  }

}

class KeyState {
  constructor() {
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
    if (this.left) player.move(-8, 0);
    if (this.right) player.move(8, 0);
    if (this.up) player.move(0, -8);
    if (this.down) player.move(0, 8);
    if (this.space) isShot = true;
  }
}
let keyState = new KeyState;

document.onkeydown = function(event) {
  //console.log("press");
  if (event.code === "ArrowUp") keyState.up = true;
  if (event.code === "ArrowDown") keyState.down = true;
  if (event.code === "ArrowLeft") keyState.left = true;
  if (event.code === "ArrowRight") keyState.right = true;
  if (event.code === "Space" ) keyState.space = true;
}

document.onkeyup = function(event) {
  //console.log("press");
  if (event.code === "ArrowUp") keyState.up = false;
  if (event.code === "ArrowDown") keyState.down = false;
  if (event.code === "ArrowLeft") keyState.left = false;
  if (event.code === "ArrowRight") keyState.right = false;
  if (event.code === "Space" ) keyState.space = false;
}

let gameCanvas = makeElement("canvas", "gameCanvas");
document.body.appendChild(gameCanvas);
const canvasHeight = 480;
const canvasWidth = 720;
gameCanvas.setAttribute("height", canvasHeight);
gameCanvas.setAttribute("width", canvasWidth);

let ctx = gameCanvas.getContext("2d");

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

let enemy = new Enemy(256, 32, [enemy1, enemy2, enemy3, enemy4]);

let shot1 = new Sprite(0, 0, 32, 5);
let shot2 = new Sprite(32, 0, 32, 5);
let shot3 = new Sprite(64, 0, 32, 5);

let flyingShot = new Sprite(96, 0, 32, 10);

let isShot = false;

let shotPng = shot1;

let shots = [];

let loopCount = 0;
let gameLoop = setInterval(function() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  keyState.update();

  if (loopCount % 5 === 0) {
    enemy.sprite++;
  }

  if (loopCount % 2 === 0) {
    player.sprite++;
  }

  player.draw(player.x, player.y);
  enemy.draw(enemy.x, enemy.y);




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
