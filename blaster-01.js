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

function write2screen(xPos, yPos, string, size = 1) {
  //----------------------------------------------------//
  //Adds sprite based letters to the screen             //
  //integer/string-> xPos: position of the top left     //
  //  corner of the first lette of the string. Can also //
  //  be a string indicating alignment: "center",       //
  //  "left", or "right"                                //
  //integer-> yPos: position of the top left pixel of   //
  //  the first letter                                  //
  //string-> string: string to be put on screen         //
  //----------------------------------------------------//

  let chars = {
    "A": new Sprite(0, 0, 8, 8),
    "B": new Sprite(8, 0, 8, 8),
    "C": new Sprite(16, 0, 8, 8),
    "D": new Sprite(24, 0, 8, 8),
    "E": new Sprite(32, 0, 8, 8),
    "F": new Sprite(40, 0, 8, 8),
    "G": new Sprite(48, 0, 8, 8),
    "H": new Sprite(56, 0, 8, 8),
    "I": new Sprite(0, 8, 8, 8),
    "J": new Sprite(8, 8, 8, 8),
    "K": new Sprite(16, 8, 8, 8),
    "L": new Sprite(24, 8, 8, 8),
    "M": new Sprite(32, 8, 8, 8),
    "N": new Sprite(40, 8, 8, 8),
    "O": new Sprite(48, 8, 8, 8),
    "P": new Sprite(56, 8, 8, 8),
    "Q": new Sprite(0, 16, 8, 8),
    "R": new Sprite(8, 16, 8, 8),
    "S": new Sprite(16, 16, 8, 8),
    "T": new Sprite(24, 16, 8, 8),
    "U": new Sprite(32, 16, 8, 8),
    "V": new Sprite(40, 16, 8, 8),
    "W": new Sprite(48, 16, 8, 8),
    "X": new Sprite(56, 16, 8, 8),
    "Y": new Sprite(0, 24, 8, 8),
    "Z": new Sprite(8, 24, 8, 8),
    "1": new Sprite(16, 24, 8, 8),
    "2": new Sprite(24, 24, 8, 8),
    "3": new Sprite(32, 24, 8, 8),
    "4": new Sprite(40, 24, 8, 8),
    "5": new Sprite(48, 24, 8, 8),
    "6": new Sprite(56, 24, 8, 8),
    "7": new Sprite(0, 32, 8, 8),
    "8": new Sprite(8, 32, 8, 8),
    "9": new Sprite(16, 32, 8, 8),
    "0": new Sprite(24, 32, 8, 8),
    "?": new Sprite(32, 32, 8, 8),
    "!": new Sprite(40, 32, 8, 8),
    ":": new Sprite(48, 32, 8, 8),
    " ": new Sprite(56, 32, 8, 8)
  };
  string = string.toString(10);
  if (typeof xPos !== "number") {
    if (xPos === "center") xPos = (canvasWidth / 2) - ((string.length * size * 8) / 2);
    if (xPos === "left") xPos = size * 8;
    if (xPos === "right") xPos = canvasWidth - ((size * 8) + (string.length * size * 8));
  }
  string.toUpperCase().split("").forEach((x, i) => {
    ctx.drawImage(whiteFont, chars[x].x, chars[x].y, chars[x].w, chars[x].h, xPos + (i * size * 8), yPos, size * 8, size * 8);
  });
}

function rectAround(xPos, yPos, string, size) {
  let scale = size * 8;
  if (typeof xPos !== "number") {
    if (xPos === "center") xPos = (canvasWidth / 2) - ((string.length * scale) / 2);
    if (xPos === "left") xPos = scale;
    if (xPos === "right") xPos = canvasWidth - (scale + (string.length * scale));
  }
  xPos = xPos - scale;
  yPos = yPos - scale;
  ctx.strokeRect(xPos, yPos, (string.length * scale) + (scale * 2), scale * 3);
  ctx.strokeStyle = "white";
  ctx.lineWidth = "5";
  ctx.strokeRect(xPos, yPos, (string.length * scale) + (scale * 2), scale * 3);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = "10";
}

function showScore(score) {
  score = score.toString(10).padStart(4, "0");
  //rectAround(16, 456, `Score: ${score}`, 1);
  write2screen(16, 456, `Score: ${score}`, 1);
}

function makeEnemy(type) {
  let xPos;
  switch(type) {
    case "ray":
      xPos = rnd(32, 656)
      let ray = new Ray(xPos, -32, rayShip);
      ray.addCollider(shots);
      enemies.push(ray);
      break;
    case "spinner":
      xPos = rnd(32, 610)
      let spinner = new Spinner(xPos, -32, spinnerShip);
      spinner.addCollider(shots);
      enemies.push(spinner);
      break;
  }
}

let score = 0;
let shots = [];
let enemies = [];

let shotSound, deathSound, bgm;
let bgmSource


const AudioContext = window.AudioContext || window. webkitAudioContext;

const audioCtx = new AudioContext();

fetch("audio/zap4.mp3")
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(buffer) {
    audioCtx.decodeAudioData(buffer, function(decodedData) {
      shotSound = decodedData;
    });
  });

fetch("audio/death3.mp3")
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(buffer) {
    audioCtx.decodeAudioData(buffer, function(decodedData) {
      deathSound = decodedData;
    });
  });

fetch("audio/short-space-loop2.mp3")
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(buffer) {
    audioCtx.decodeAudioData(buffer, function(decodedData) {
      bgm = decodedData;
    });
  });

function playShot(buffer) {
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = .85 + (rnd(-15, 15) / 100);
  source.connect(audioCtx.destination);
  source.start(0);
}

function playDead(buffer) {
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);
}

const bgmGain = audioCtx.createGain();

function playBGM(buffer) {
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  let vol = 0;
  bgmGain.gain.value = vol;
  source.connect(bgmGain).connect(audioCtx.destination);
  source.loop = true;
  source.start(0);
  let fadeIn = setInterval(function() {
    bgmGain.gain.value = vol;
    if (vol >= .5) {
      clearInterval(fadeIn);
    }
    vol += .01;
  }, 40);
  return source;
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
    this._lives = 3;
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

  get lives() {
    return this._lives;
  }

  set lives(count) {
    this._lives = count;
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
            this.x + this.w > this.colliders[i][j].x &&
            this.y < this.colliders[i][j].y + this.colliders[i][j].h &&
            this.y + this.h > this.colliders[i][j].y) {
              //console.log(this.x, self.w, this.y, self.h);
              //console.log(this.colliders[i][j]);
              this.colliders[i].splice(j, 1);
              playDead(deathSound);
              return true;

            }
      }
    }
    return false;
  }

  update(x, y, c) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //integer-> x, y: the position at which to draw the //
    //  ship                                            //
    //--------------------------------------------------//

    if (c % 2 === 0) {
      this.sprite++;
    }

    if (this.collide(shots) && !this.dead) {
      this.die();
    }
    if (this.dead && this.sprite >= this.sprites.length) {
      if (this.lives > 0) {
        console.log(`count: ${c}, lives ${this.lives}`);
        clearInterval(gameLoop);
        this.dead = false;
        this.sprites = playerShip;
        this.x = 344;
        this.y = 400;
        this.lives--;
        bgmSource.stop(0);
        runGameLoop();
      } else {
        youDead();
      }
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
    this._active = true;
  }

  get active() {
    return this._active;
  }

  set active(state) {
    this._active = state;
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
      score++;
      console.log(score);
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

  die() {
    this.dead = true;
    this.active = false;
    this.sprites = this.death;
    this.sprite = 0;
  }
}

class Ray extends Enemy {
  constructor(originX, originY, sprites) {
    super(originX, originY, sprites);
    this._death = rayDeath;
    this._count = 0;
  }

  get count() {
    return this._count;
  }

  set count(cnt) {
    this._count = cnt;
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

    if (c % 2 === 0) {
      this.sprite++;
    }
    //
    //If there is a collision and it's not dead, kill it
    if (!this.dead) {
      if (this.collide(shots)) {
        this.die();
      }
    }
    //
    //If it's dead and animated, remove it,
    //  otherwise draw it.
    if (this.dead && this.sprite >= this.sprites.length) {
      enemies.splice(i, 1);
      score++;
    } else {
      this.count++;
      if (this.count > 40) {
        this.move(0, this.count - 44);
      } else if (this.count < 24){
        this.move(0, 2);
      }

      this.draw(x, y);
    }
  }

  move(x, y) {
    //--------------------------------------------------//
    //Updates the ship's position and prevents it from  //
    //  leaving the bounds of the <canvas>              //
    //integer-> x, y: How much to change the position   //
    //  of the ship                                     //
    //--------------------------------------------------//

    /*if (this.x + x < canvasWidth - 32
      && this.x + x > 0) {
        this.x = this.x + x;
    }*/
    if (this.y > canvasHeight) {
      this.count = 0;
      this.y = -32;
      this.x = rnd(32, 656);
    } else {
      this.y = this.y + y;
    }
  }
}

class Spinner extends Enemy {
  constructor(originX, originY, sprites) {
    super(originX, originY, sprites);
    this._death = spinnerDeath;
    this._count = 0;
  }

  get count() {
    return this._count;
  }

  set count(cnt) {
    this._count = cnt;
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

    if (c % 2 === 0) {
      this.sprite++;
    }
    //
    //If there is a collision and it's not dead, kill it
    if (!this.dead) {
      if (this.collide(shots)) {
        this.die();
      }
    }
    //
    //If it's dead and animated, remove it,
    //  otherwise draw it.
    if (this.dead && this.sprite >= this.sprites.length) {
      enemies.splice(i, 1);
      score++;
    } else {
      this.count++;
      if (this.count > 40) {
        let moveX = parseInt(15 * Math.cos(((this.count % 21) * 18) * (Math.PI/180)));
        this.move(moveX, 5);
      } else if (this.count < 24){

        this.move(0, 2);
      }

      this.draw(x, y);
    }
  }

  move(x, y) {
    //--------------------------------------------------//
    //Updates the ship's position and prevents it from  //
    //  leaving the bounds of the <canvas>              //
    //integer-> x, y: How much to change the position   //
    //  of the ship                                     //
    //--------------------------------------------------//

    /*if (this.x + x < canvasWidth - 32
      && this.x + x > 0) {*/
        this.x = this.x + x;
    //}*/
    if (this.y > canvasHeight) {
      this.count = 0;
      this.y = -32;
      this.x = rnd(32, 656);
    } else {
      this.y = this.y + y;
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
    this._active = true;
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

  get active() {
    return this._active;
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

class TitleKeys extends KeyState {
  constructor() {
    super();
  }

  get space() {
    return this._space;
  }

  set space(state) {
    this._space = state;
  }

  update() {
    if (this.space) runGameLoop();
  }
}

class DeadKeys extends KeyState {
  constructor() {
    super();
    this._locked = false;
  }

  get space() {
    return this._space;
  }

  set space(state) {
    this._space = state;
  }

  get locked() {
    return this._locked;
  }

  set locked(state) {
    this._locked = state;
  }

  update() {
    if (!this.locked) {
      if (this.space) newGameLoop();
    }

  }
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
ctx.imageSmoothingEnabled = false;
//
//Loading the sprite sheet
let blastSheet = new Image();
blastSheet.src = "blastSheet.png";
//
//Loading the font sheet
let whiteFont = new Image();
whiteFont.src = "8-bitFontWhite.png";
whiteFont.addEventListener("load", x => {
  newGameLoop();
})

//
//Makes the player's ship
let playerShip = [new Sprite(0, 5, 32, 27),
                  new Sprite(32, 5, 32, 27),
                  new Sprite(64, 5, 32, 27)];
let playerShipDeath = [new Sprite(0, 101, 32, 27),
                        new Sprite(32, 101, 32, 27),
                        new Sprite(64, 101, 32, 27),
                        new Sprite(96, 101, 32, 27)];

/*player = new Player(344, 400, playerShip);
player.death = playerShipDeath;
player.addCollider(enemies);*/
//
//Defines the sprites for the ray ship
let rayShip = [new Sprite(0, 32, 32, 32),
                new Sprite(32, 32, 32, 32),
                new Sprite(0, 32, 32, 32),
                new Sprite(64, 32, 32, 32)];
let rayDeath = [new Sprite(0, 64, 32, 32),
                new Sprite(32, 64, 32, 32),
                new Sprite(64, 64, 32, 32),
                new Sprite(96, 64, 32, 32)];

let spinnerShip = [new Sprite(0, 128, 32, 32),
                    new Sprite(32, 128, 32, 32),
                    new Sprite(64, 128, 32, 32)];
let spinnerDeath = [new Sprite(0, 160, 32, 32),
                    new Sprite(32, 160, 32, 32),
                    new Sprite(64, 160, 32, 32),
                    new Sprite(96, 160, 32, 32)];

let shot1 = new Sprite(0, 0, 32, 5);
let shot2 = new Sprite(32, 0, 32, 5);
let shot3 = new Sprite(64, 0, 32, 5);

let flyingShot = new Sprite(96, 0, 32, 10);

let isShot = false;

let shotPng = shot1;

let kill = [];
let keyDown = [];
let keyUp = [];

let gameLoop;

function newGameLoop() {

  enemies = [];
  shots = [];
  score = 0;
  let keyState = new TitleKeys;

  function gameKeysDown(event) {
    //----------------------------------------------------//
    //Listens for a key to be pressed down                //
    //event-> event: the key down event                   //
    //----------------------------------------------------//

    //console.log("pressed");
    //if (event.code === "ArrowUp") keyState.up = true;
    //if (event.code === "ArrowDown") keyState.down = true;
    //if (event.code === "ArrowLeft") keyState.left = true;
    //if (event.code === "ArrowRight") keyState.right = true;
    if (event.code === "Space" ) keyState.space = true;
  }

  function gameKeysUp(event) {
    //----------------------------------------------------//
    //Listens for a key to be released                    //
    //event-> event: the keyboard event                   //
    //----------------------------------------------------//

    //if (event.code === "ArrowUp") keyState.up = false;
    //if (event.code === "ArrowDown") keyState.down = false;
    //if (event.code === "ArrowLeft") keyState.left = false;
    //if (event.code === "ArrowRight") keyState.right = false;
    if (event.code === "Space" ) keyState.space = false;
  }

  keyDown.forEach(x => {
    document.removeEventListener("keydown", x);
    keyDown.shift();
  });
  document.addEventListener("keydown", gameKeysDown);
  keyDown.push(gameKeysDown);

  keyUp.forEach(x => {
    document.removeEventListener("keyup", x);
    keyUp.shift();
  });
  document.addEventListener("keyup", gameKeysUp);
  keyUp.push(gameKeysUp);

  player = new Player(344, 400, playerShip);
  player.death = playerShipDeath;

  clearInterval(gameLoop);
  let loopCount = 0;
  gameLoop = setInterval(function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    keyState.update();

    if (loopCount % 20 > 10) {
      rectAround("center", 150, "new game", 2);
    }

    write2screen("center", 150, "new game", 2);
    write2screen("center", 198, "press space");
    loopCount++;
  }, 40);
}

function runGameLoop() {
  let keyState = new KeyState;
  enemies = [];
  shots = [];
  console.log(player.lives);
  bgmSource = playBGM(bgm);

  function gameKeysDown(event) {
    //----------------------------------------------------//
    //Listens for a key to be pressed down                //
    //event-> event: the key down event                   //
    //----------------------------------------------------//

    if (event.code === "ArrowUp") keyState.up = true;
    if (event.code === "ArrowDown") keyState.down = true;
    if (event.code === "ArrowLeft") keyState.left = true;
    if (event.code === "ArrowRight") keyState.right = true;
    if (event.code === "Space" ) keyState.space = true;
  }

  function gameKeysUp(event) {
    //----------------------------------------------------//
    //Listens for a key to be released                    //
    //event-> event: the keyboard event                   //
    //----------------------------------------------------//

    if (event.code === "ArrowUp") keyState.up = false;
    if (event.code === "ArrowDown") keyState.down = false;
    if (event.code === "ArrowLeft") keyState.left = false;
    if (event.code === "ArrowRight") keyState.right = false;
    if (event.code === "Space" ) keyState.space = false;
  }

  clearInterval(gameLoop);
  //
  //Clear the keydown and keyup event listeners
  keyDown.forEach(x => document.removeEventListener("keydown", x));
  document.addEventListener("keydown", gameKeysDown);
  keyDown.push(gameKeysDown);

  keyUp.forEach(x => document.removeEventListener("keyup", x));
  document.addEventListener("keyup", gameKeysUp);
  keyUp.push(gameKeysUp);

  player.addCollider(enemies);

  let loopCount = 0;
  gameLoop = setInterval(function() {
    //
    //Clear the screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //
    //Check key presses
    keyState.update();
    //
    //Update player state
    player.update(player.x, player.y, loopCount);
    //
    //Update enemy states
    enemies.forEach((x, i) => x.update(x.x, x.y, i, loopCount));
    //
    //Update score
    showScore(score);
    //
    //Show lives
    ctx.drawImage(blastSheet, 0, 5, 32, 27, 688, 450, 19, 16);
    write2screen(672, 456, player.lives);
    //
    //Flash "Get Ready!" at beginning of round
    if (loopCount < 50) {
      if (loopCount % 10 > 5) {
        write2screen("center", 150, "Get Ready!", 2);
      }
    }
    //
    //Make a new enemy
    if (loopCount % 30 === 0 && loopCount > 50) {
      if (enemies.length < 7) {
        if (rnd(1, 100) % 2 === 0) {
          makeEnemy("ray");
        } else {
          makeEnemy("spinner");
        }
      }
    }
    //
    //Move the shots up the screen
    shots.forEach(function(x) {
      if (x.y < 0) {
        shots.shift();
      } else {
        x.draw();
      }
    });
    //
    //Animate the shot blast
    if (isShot) {

      ctx.drawImage(blastSheet, shotPng.x, shotPng.y, shotPng.w, shotPng.h, player.x, player.y - 5, shotPng.w, shotPng.h);
      if (shotPng === shot1) {
        shotPng = shot2;
      } else if (shotPng === shot2) {
        shotPng = shot3
      } else {
        playShot(shotSound);
        isShot = false;
        shotPng = shot1;
        let shotX = new Shot();
        shots.push(shotX);
      }
    }
    //
    //Keep track of the loops
    loopCount++;
    /*if (loopCount > 10) {
      clearInterval(gameLoop);
    }*/
  }, 40);
}

function youDead() {
  let keyState = new DeadKeys;
  //keyState.locked = true;

  bgmSource.stop(0);

  function gameKeysDown(event) {
    //----------------------------------------------------//
    //Listens for a key to be pressed down                //
    //event-> event: the key down event                   //
    //----------------------------------------------------//

    //console.log("pressed");
    //if (event.code === "ArrowUp") keyState.up = true;
    //if (event.code === "ArrowDown") keyState.down = true;
    //if (event.code === "ArrowLeft") keyState.left = true;
    //if (event.code === "ArrowRight") keyState.right = true;
    if (event.code === "Space" ) keyState.space = true;
  }

  function gameKeysUp(event) {
    //----------------------------------------------------//
    //Listens for a key to be released                    //
    //event-> event: the keyboard event                   //
    //----------------------------------------------------//

    //if (event.code === "ArrowUp") keyState.up = false;
    //if (event.code === "ArrowDown") keyState.down = false;
    //if (event.code === "ArrowLeft") keyState.left = false;
    //if (event.code === "ArrowRight") keyState.right = false;
    if (event.code === "Space" ) keyState.space = false;
  }

  keyDown.forEach(x => {
    document.removeEventListener("keydown", x);
    keyDown.shift();
  });
  document.addEventListener("keydown", gameKeysDown);
  keyDown.push(gameKeysDown);

  keyUp.forEach(x => {
    document.removeEventListener("keyup", x);
    keyUp.shift();
  });
  document.addEventListener("keyup", gameKeysUp);
  keyUp.push(gameKeysUp);

  clearInterval(gameLoop);

  loopCount = 0;
  gameLoop = setInterval(function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //
    //Update score
    showScore(score);

    if (loopCount < 50) {
      write2screen("center", 150, "You Died!", 2);
    } else {
      write2screen("center", 150, "Do you want to play again?", 2);
      write2screen("center", 198, "press space");
      keyState.update();
    }

    if (loopCount % 20 > 10 && loopCount > 50) {
      rectAround("center", 150, "Do you want to play again?", 2);
    }




    loopCount++;
  }, 40);


}
