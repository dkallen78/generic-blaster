window.onload = function() {
  init();
  activeLoop = requestAnimationFrame(initLoop);
}

//------------------------------------------------------//
//Global Variable Club: Cool kids only!                 //
//------------------------------------------------------//
//
//Preloaded assets counter
let preload = 0;
//
//Web Audio API context
let audioCtx;
//
//Holds the sfx audio buffers
let shotSound, deathSound, ammoUp;
//
//Background Music buffers
let bgm1, bgmGain, bgmSource
//
//Game context
const gameScreen = document.getElementById("screen");
let ctx;
const canvasHeight = 480;
const canvasWidth = 720;
//
//Sprite sheets
let spriteSheet, fontSheet;
//
//Keboard state
let keyState;
//
//Game loop
let activeLoop, loopCount, endLoop = false;
//
//Arrays of things
let shots = [], enemies = [];
//
//Game variables
let player, score;

function init() {
  //----------------------------------------------------//
  //loads all of the data for the game                  //
  //Preload: 6                                          //
  //----------------------------------------------------//
  //
  //Load audio data (preload: 4)
  (function() {
    const AudioContext = window.AudioContext || window. webkitAudioContext;

    audioCtx = new AudioContext();

    fetch("audio/zap4.mp3")
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        audioCtx.decodeAudioData(buffer, function(decodedData) {
          shotSound = decodedData;
          preload++;
        });
      });

    fetch("audio/death4.mp3")
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        audioCtx.decodeAudioData(buffer, function(decodedData) {
          deathSound = decodedData;
          preload++;
        });
      });

    fetch("audio/ammoUp.mp3")
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        audioCtx.decodeAudioData(buffer, function(decodedData) {
          ammoUp = decodedData;
          preload++;
        });
      });

    fetch("audio/short-space-loop2.mp3")
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        audioCtx.decodeAudioData(buffer, function(decodedData) {
          bgm1 = decodedData;
          preload++;
        });
      });
  })();
  //
  //Load image data (preload 2)
  (function() {
    //
    //Make the primary canvas
    let gameCanvas = makeElement("canvas", "gameCanvas");
    gameScreen.appendChild(gameCanvas);
    gameCanvas.setAttribute("height", canvasHeight);
    gameCanvas.setAttribute("width", canvasWidth);
    //
    //Setting the context
    ctx = gameCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    //
    //Make the in-game stats canvas
    let statCanvas = makeElement("canvas", "statCanvas");
    gameScreen.appendChild(statCanvas);
    statCanvas.setAttribute("width", canvasWidth);
    statCanvas.setAttribute("height", 32);

    statCtx = statCanvas.getContext("2d");
    statCtx.imageSmoothingEnabled = false;
    //
    //Load the primary sprite sheet
    let blastSheet = new Image();
    blastSheet.src = "spriteSheet.png";
    blastSheet.onload = function() {
      spriteSheet = makeElement("canvas", "spriteSheet");
      spriteSheet.setAttribute("width", 160);
      spriteSheet.setAttribute("height", 352);
      let spriteSheetCtx = spriteSheet.getContext("2d");
      spriteSheetCtx.drawImage(blastSheet, 0, 0, 160, 352);
      preload++
    }
    //
    //Loading the font sheet
    let whiteFont = new Image();
    whiteFont.src = "8-bitFontWhite.png";
    whiteFont.onload = function() {
      fontSheet = makeElement("canvas", "fontSheet");
      fontSheet.setAttribute("width", 64);
      fontSheet.setAttribute("height", 40);
      let fontSheetCtx = fontSheet.getContext("2d");
      fontSheetCtx.drawImage(whiteFont, 0, 0, 64, 40);
      preload++;
    }

  })();
}

function makeElement(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an HTML element                             //
  //----------------------------------------------------//
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
  //----------------------------------------------------//
  //integer-> floor: lower bound of the random number   //
  //integer-> ceiling: upper bound of the random number //
  //return-> integer: random number between [floor]     //
  //  and [ceiling]                                     //
  //----------------------------------------------------//

  let range = (ceiling - floor) + 1;
  return Math.floor((Math.random() * range) + floor);
}

function write2screen(ctx, xPos, yPos, string, size = 1) {
  //----------------------------------------------------//
  //Adds sprite based letters to the screen             //
  //----------------------------------------------------//
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
    ctx.drawImage(fontSheet, chars[x].x, chars[x].y, chars[x].w, chars[x].h, xPos + (i * size * 8), yPos, size * 8, size * 8);
  });
}

function playSfx(buffer) {
  //----------------------------------------------------//
  //Plays a sound effect                                //
  //----------------------------------------------------//
  //binary-> buffer: audio buffer to be played          //
  //----------------------------------------------------//

  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = .85 + (rnd(-15, 15) / 100);
  source.connect(audioCtx.destination);
  source.start(0);
}

function playBGM(buffer) {
  //----------------------------------------------------//
  //Plays background music                              //
  //----------------------------------------------------//
  //binary-> buffer: audio buffer to be played          //
  //----------------------------------------------------//

  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  let vol = 0;
  bgmGain = audioCtx.createGain();
  bgmGain.gain.value = vol;
  source.connect(bgmGain).connect(audioCtx.destination);
  source.loop = true;
  source.start(0);
  //
  //Gently fade in the sound before game
  let fadeIn = setInterval(function() {
    bgmGain.gain.value = vol;
    if (vol >= .5) {
      clearInterval(fadeIn);
    }
    vol += .01;
  }, 40);
  return source;
}

function showScore(score) {
  statCtx.clearRect(8, 12, 96, 8);
  if (score % 25 === 0 && score > 0) {
    playSfx(ammoUp);
    player.ammo += 50;
    showAmmo(player.ammo);
  }
  if (score % 150 === 0 && score > 0) {
    showLives(++player.lives);
  }
  score = score.toString(10).padStart(4, "0");
  write2screen(statCtx, "left", 12, `Bounty: ${score}`);
}

function showAmmo(ammo) {
  statCtx.clearRect(259, 7, 201, 18);
  //
  //Draw the outline of the guage
  statCtx.strokeStyle = "white";
  statCtx.lineWidth = 2;
  statCtx.strokeRect(259, 7, 201, 18);
  //
  //Blue ammo bar
  statCtx.fillStyle = ammo < 25 ? "red" : "blue";
  let blueBar = ammo >= 100 ? 200 : ammo * 2;
  statCtx.fillRect(260, 8, blueBar, 16);
  //
  //Green ammo bar
  if (ammo > 100) {
    statCtx.fillStyle = "green"
    statCtx.fillRect(260, 8, (ammo - 100) * 2, 16);
  }
}

function showLives(lives) {
  statCtx.clearRect(672, 8, 704, 16);
  lives = lives < 0 ? 0 : lives;
  statCtx.drawImage(spriteSheet, 0, 0, 32, 32, 688, 8, 16, 16);
  write2screen(statCtx, 672, 12, lives);
}

function makeEnemy(type) {
  let xPos;
  switch(type) {
    case "ray":
      xPos = rnd(32, 688)
      let ray = new Ray(xPos, -32);
      enemies.push(ray);
      break;
    case "ring":
      xPos = rnd(200, 688)
      let spinner = new Ring(xPos, -32);
      enemies.push(spinner);
      break;
  }
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

  static load(xStart, yStart, xSize, ySize, direction, frames) {
    //--------------------------------------------------//
    //Makes an array of Sprites based on the position   //
    //  of the first element                            //
    //--------------------------------------------------//
    //integer-> xStart, yStart: the starting coordinates//
    //  for the top left corner of the first sprite     //
    //integer-> xSize, ySize: the size in pixels of the //
    //  sprites to be loaded                            //
    //string-> direction: the orientation of the sprites//
    //  on the sprite sheet                             //
    //integer-> frames: the number of sprites to be     //
    //  loaded into the array                           //
    //--------------------------------------------------//
    //return-> array: Sprite objects                    //
    //--------------------------------------------------//

    let array = [];
    for (let i = 0; i < frames; i++) {
      array.push(new Sprite(xStart, yStart, xSize, ySize));
      switch(direction) {
        case "right":
          xStart += xSize;
          break;
        case "down":
          yStart += ySize;
          break;
      }
    }
    return array;
  }
}

class Shot {
  //----------------------------------------------------//
  //A data structure for holding information about      //
  //  the shots fired by the player                     //
  //----------------------------------------------------//

  constructor(x = player.x, y = player.y) {
    //--------------------------------------------------//
    //integer-> x, y: where to first place              //
    //  the shot sprite                                 //
    //--------------------------------------------------//
    //integer-> w, h: width and height of the sprite    //
    //--------------------------------------------------//

    this.x = x;
    this.y = y - 7;
    this.w = 32;
    this.h = 7;
    this.count = 0;
    this.sprite = 0;
    this.sprites = [new Sprite(128, 0, 32, 7),
                    new Sprite(128, 7, 32, 7),
                    new Sprite(128, 14, 32, 7),
                    new Sprite(128, 14, 32, 7)];
  }

  currentSprite(num) {
    return this.sprites[num % this.sprites.length];
  }

  draw(x, y) {
    //--------------------------------------------------//
    //Draws the sprite, advancing it 16 pixesls for     //
    //  each frame                                      //
    //--------------------------------------------------//

    let img = this.currentSprite(this.sprite);
    if (this.count < 3) {
      this.sprite++;
      this.x = x;
      this.y = y - this.h;
      ctx.drawImage(spriteSheet, img.x, img.y, img.w, img.h, this.x, this.y, this.w, this.h);
    } else {
      this.y -= 12;
      ctx.drawImage(spriteSheet, img.x, img.y, img.w, img.h, this.x, this.y, this.w, this.h);
    }
    this.count++;
  }
}

class Ship {
  //----------------------------------------------------//
  //A class for the player and any enemies              //
  //----------------------------------------------------//

  constructor(x, y) {
    //--------------------------------------------------//
    //integer-> x, y: where to initially draw the       //
    //  object on the coordinate plane                  //
    //--------------------------------------------------//
    //integer-> h, w: height and width of the object    //
    //  in pixels                                       //
    //integer-> count: used internally when ships need  //
    //  to count frames                                 //
    //boolean-> dead: whether or not the ship is dead   //
    //array(Sprite)-> sprites: sprites for the default  //
    //  animation of the ship                           //
    //array(Sprite)-> death: sprites for the death      //
    //  animation of the ship                           //
    //integer-> sprite: index of the current sprite in  //
    //  the animation                                   //
    //array(array)-> colliders: objects to test for     //
    //  collisions                                      //
    //function-> queuedAction: action to take at the end//
    //  of a non-default animation cycle (eg, death)    //
    //--------------------------------------------------//

    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.count = 0;
    this.dead = false;
    this.sprites;
    this.death;
    this.sprite = 0;
    this.colliders = [];
    this.currentAnimation = this.sprites;
    this.queuedAction = null;
  }

  currentSprite(num) {
    return this.currentAnimation[num % this.currentAnimation.length];
  }

  collide() {
    //--------------------------------------------------//
    //Checks the [this.colliders] array to see if a     //
    //  collision has occurred                          //
    //--------------------------------------------------//
    //return-> boolean: true for collision              //
    //--------------------------------------------------//

    //console.log(this.x, this.y, this.w, this.h);
    for (let i = 0; i < this.colliders.length; i++) {
      for (let j = 0; j < this.colliders[i].length; j++) {
        if (this.x < this.colliders[i][j].x + this.colliders[i][j].w &&
            this.x + this.w > this.colliders[i][j].x &&
            this.y < this.colliders[i][j].y + this.colliders[i][j].h &&
            this.y + this.h > this.colliders[i][j].y) {
              //console.log(this.x, this.w, this.y, this.h);
              //console.log(this.colliders[i][j]);
              this.colliders[i].splice(j, 1);
              playSfx(deathSound);
              return true;
            }
      }
    }
    return false;
  }

  update(c) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //integer-> x, y: the position at which to draw the //
    //  object                                          //
    //--------------------------------------------------//

    if (c % 2 === 0) {
      if (this.currentAnimation !== this.sprites &&
          this.sprite === this.currentAnimation.length - 1) {
            this.currentAnimation = this.sprites;
          }
      this.sprite++;

    }
    this.draw(this.x, this.y);
  }

  draw(x, y) {
    //--------------------------------------------------//
    //Draws the object on the screen                    //
    //--------------------------------------------------//
    //integer-> x, y: Where to draw the ship            //
    //--------------------------------------------------//

    let img = this.currentSprite(this.sprite);
    ctx.drawImage(spriteSheet, img.x, img.y, img.w, img.h, x, y, img.w, img.h);
  }

  die() {
    this.dead = true;
    this.currentAnimation = this.death;
    this.sprite = 0;
  }

}

class Player extends Ship {
  //----------------------------------------------------//
  //A sub-class for the player's ship                   //
  //----------------------------------------------------//

  constructor(x, y) {
    super(x, y);
    this.w = 32;
    this.h = 32;
    this.lives = 3;
    this.ammo = 100;
    this.sprites = Sprite.load(0, 0, 32, 32, "right", 4);
    this.fire = Sprite.load(0, 32, 32, 32, "right", 4);
    this.death = Sprite.load(0, 192, 32, 32, "right", 5);
    this.colliders = [enemies];
    this.currentAnimation = this.sprites;
  }

  get lastSprite() {
    //--------------------------------------------------//
    //return-> boolean: whether or not the current      //
    //  sprite is the last one it its animation cycle   //
    //--------------------------------------------------//

    return (this.sprite % this.currentAnimation.length === this.currentAnimation.length - 1);
  }

  collide() {
    //--------------------------------------------------//
    //Checks the [this.colliders] array to see if a     //
    //  collision has occurred                          //
    //--------------------------------------------------//
    //return-> boolean: true for collision              //
    //--------------------------------------------------//

    //console.log(this.x, this.y, this.w, this.h);
    for (let i = 0; i < this.colliders.length; i++) {
      for (let j = 0; j < this.colliders[i].length; j++) {
        if (this.x < this.colliders[i][j].x + this.colliders[i][j].w &&
            this.x + this.w > this.colliders[i][j].x &&
            this.y < this.colliders[i][j].y + this.colliders[i][j].h &&
            this.y + this.h > this.colliders[i][j].y) {
              //console.log(this.x, this.w, this.y, this.h);
              //console.log(this.colliders[i][j]);
              if (this.colliders[i] === enemies) {
                showScore(++score);
              }
              this.colliders[i].splice(j, 1);
              playSfx(deathSound);
              return true;
            }
      }
    }
    return false;
  }

  update(c) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //--------------------------------------------------//
    //integer-> x, y: the position at which to draw the //
    //  object                                          //
    //--------------------------------------------------//
    //
    //Update the sprite every other frame
    if (c % 2 === 0) {
      //
      //If the special animation cycle is over, revert
      //  to the default animation
      if (this.currentAnimation !== this.sprites && this.lastSprite) {
        this.currentAnimation = this.sprites;
        //
        //If there are any queued actions to take, execute them
        if (this.queuedAction !== null) {
          this.queuedAction();
          this.queuedAction = null;
        }
      }
      this.sprite++;
    }
    //
    //If the player is not dead, check for collisions
    if (this.collide() && !this.dead) {
      this.die();
    }
    //If the player is not dead, draw the sprite
    if (!this.dead) {
      this.draw(this.x, this.y);
    }
  }

  move(x, y) {
    //--------------------------------------------------//
    //Updates the ship's position and prevents it from  //
    //  leaving the bounds of the <canvas>              //
    //--------------------------------------------------//
    //integer-> x, y: How much to change the position   //
    //  of the ship                                     //
    //--------------------------------------------------//

    if (this.x + x < canvasWidth - 32 &&
        this.x + x > 0) {
          this.x = this.x + x;
    }
    if (this.y + y < canvasHeight - 64 &&
        this.y + y > 0) {
          this.y = this.y + y;
    }
  }

  shoot() {
    if (this.ammo > 0) {
      this.currentAnimation = this.fire;
      this.queuedAction = function() {
        playSfx(shotSound);
        let newShot = new Shot();
        shots.push(newShot);
        showAmmo(--this.ammo);
      }
    } else {}//play empty ammo sound
  }

  die() {
    //--------------------------------------------------//
    //What to do when the player dies                   //
    //--------------------------------------------------//
    //
    //Change the animation
    this.currentAnimation = this.death;
    this.sprite = 0;
    //
    //Run after the death animation
    this.queuedAction = function() {
      this.dead = true;
      endLoop = true;
      showLives(--this.lives);
      //
      //Clears the screen of any shots or enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        enemies.pop();
      }
      for (let i = shots.length - 1; i >= 0; i--) {
        shots.pop();
      }
      //
      //If there are lives remaining, reposition the player
      //  and restart the gameLoop
      //  Otherwise, stop the bgm and go to the gameOverLoop
      if (this.lives >= 0) {
        this.x = 346;
        this.y = 416;
        setTimeout(function() {
          gameInit();
        }, 500);
      } else {
        bgmSource.stop(0);
        setTimeout(function() {
          gameOverInit();
        }, 100);
      }
    }
  }
}

class AmmoBoost extends Ship {
  constructor(x, y) {
    super(x, y);
    this.sprites = Sprite.load(0, 224, 32, 32, "right", 4);
    this.death = Sprite.load(0, 256, 32, 32, "right", 4);
  }
}

class Ray extends Ship {
  //----------------------------------------------------//
  //A sub-class for the Ray type enemy ship             //
  //----------------------------------------------------//

  constructor(x, y) {
    super(x, y);
    this.sprites = Sprite.load(0, 64, 32, 32, "right", 4);
    this.death = Sprite.load(0, 96, 32, 32, "right", 4);
    this.colliders = [shots];
    this.currentAnimation = this.sprites;
  }

  update(x, y, i, c) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //--------------------------------------------------//
    //integer-> x, y: the position at which to draw the //
    //  ship                                            //
    //integer-> i: enemy's index in the enemy array     //
    //integer-> c: current frame count                  //
    //--------------------------------------------------//

    if (c % 3 === 0) {
      this.sprite++;
    }
    //
    //If there is a collision and it's not dead, kill it
    if (!this.dead) {
      if (this.collide()) {
        this.die();
      }
    }
    //
    //If it's dead and animated, remove it,
    //  otherwise draw it.
    if (this.dead && this.sprite >= this.sprites.length) {
      enemies.splice(i, 1);
      showScore(++score);
    } else {
      this.count++;
      if (this.count > 20) {
        this.move(0, Math.floor(this.count / 8) - 4);
      } else if (this.count < 12){
        this.move(0, 4);
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

    if (this.y > canvasHeight) {
      this.count = 0;
      this.y = -32;
      this.x = rnd(32, 656);
    } else {
      this.y = this.y + y;
    }
  }
}

class Ring extends Ship {

  constructor(x, y) {
    super(x, y);
    this.sprites = Sprite.load(0, 128, 32, 32, "right", 4);
    this.death = Sprite.load(0, 160, 32, 32, "right", 4);
    this.colliders = [shots];
    this.currentAnimation = this.sprites;
  }

  update(x, y, i, c) {
    //--------------------------------------------------//
    //The actions that need to be taken during each     //
    //  loop of the game loop                           //
    //--------------------------------------------------//
    //integer-> x, y: the position at which to draw the //
    //  ship                                            //
    //integer-> i: enemy's index in the enemy array     //
    //integer-> c: current frame count                  //
    //--------------------------------------------------//

    if (c % 3 === 0) {
      this.sprite++;
    }
    //
    //If there is a collision and it's not dead, kill it
    if (!this.dead) {
      if (this.collide()) {
        this.die();
      }
    }
    //
    //If it's dead and animated, remove it,
    //  otherwise draw it.
    if (this.dead && this.sprite >= this.sprites.length) {
      enemies.splice(i, 1);
      showScore(++score);
    } else {
      this.count++;
      if (this.count > 20) {
        let moveX = Math.floor(10 * Math.cos(((this.count % 61) * 6) * (Math.PI/180)));
        this.move(moveX, 3);
      } else if (this.count < 12){
        this.move(0, 4);
      }

      this.draw(x, y);
    }
  }

  move(x, y) {
    //--------------------------------------------------//
    //Updates the ship's position and recycles it to the//
    //  top of the screen if it leaves the screen       //
    //--------------------------------------------------//
    //integer-> x, y: How much to change the position   //
    //  of the ship                                     //
    //--------------------------------------------------//

    this.x = this.x + x;
    if (this.y > canvasHeight) {
      this.count = 0;
      this.y = -32;
      this.x = rnd(200, 688);
    } else {
      this.y = this.y + y;
    }
  }
}

class KeyState {
  //----------------------------------------------------//
  //A data structure for holding information about      //
  //  which keys have been pressed                      //
  //----------------------------------------------------//

  constructor() {
    //----------------------------------------------------//
    //boolean-> all: the state of each key press         //
    //----------------------------------------------------//

    this.left = false;
    this.doLeft;
    this.right = false;
    this.doRight;
    this.up = false;
    this.doUp;
    this.down = false;
    this.doDown;
    this.space = false;
    this.doSpace
  }

  update() {
    //--------------------------------------------------//
    //What to do if a particular key has been pressed   //
    //--------------------------------------------------//

    if (this.left) this.doLeft();
    if (this.right) this.doRight();
    if (this.up) this.doUp();
    if (this.down) this.doDown();
    if (this.space) this.doSpace();
  }

  static gameKeysDown(event) {
    //--------------------------------------------------//
    //Listens for a key to be pressed down              //
    //--------------------------------------------------//
    //event-> event: the key down event                 //
    //--------------------------------------------------//

    //console.log(event.code);
    if (event.code === "ArrowUp" && keyState.doUp) keyState.up = true;
    if (event.code === "ArrowDown" && keyState.doDown) keyState.down = true;
    if (event.code === "ArrowLeft" && keyState.doLeft) keyState.left = true;
    if (event.code === "ArrowRight" && keyState.doRight) keyState.right = true;
    if (event.code === "Space" && keyState.doSpace) keyState.space = true;
  }

  static gameKeysUp(event) {
    //----------------------------------------------------//
    //Listens for a key to be released                    //
    //----------------------------------------------------//
    //event-> event: the keyboard event                   //
    //----------------------------------------------------//

    if (event.code === "ArrowUp") keyState.up = false;
    if (event.code === "ArrowDown") keyState.down = false;
    if (event.code === "ArrowLeft") keyState.left = false;
    if (event.code === "ArrowRight") keyState.right = false;
    if (event.code === "Space" ) keyState.space = false;
  }
}

document.addEventListener("keydown", KeyState.gameKeysDown);
document.addEventListener("keyup", KeyState.gameKeysUp);

function initLoop(tFrame) {
  if (preload === 6) {
    cancelAnimationFrame(activeLoop);
    newGameInit();
  } else {
    requestAnimationFrame(initLoop);
  }
  console.log(preload);
}

function newGameInit() {
  //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  player = new Player(346, 416);
  endLoop = false;
  loopCount = 0;
  keyState = new KeyState;
  keyState.doSpace = function() {
    endLoop = true;
  }

  activeLoop = requestAnimationFrame(newGameLoop);
}

function newGameLoop(tFrame) {
  if (endLoop) {
    cancelAnimationFrame(activeLoop);
    score = 0;
    bgmSource = playBGM(bgm1);
    gameInit();
  } else {
    requestAnimationFrame(newGameLoop);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(spriteSheet, 0, 288, 128, 64, 232, 100, 256, 128);

  if (loopCount % 60 > 30) {
    write2screen(ctx, "center", 250, "New Game", 2);
  }
  write2screen(ctx, "center", 280, "Press Space");
  keyState.update();
  loopCount++;
}

function gameInit() {
  //
  //Assign key functions
  keyState = new KeyState;
  setTimeout(function() {
    (function() {
      let rate = 6;
      keyState.doLeft = function() {player.move(-rate, 0)}
      keyState.doRight = function() {player.move(rate, 0)}
      keyState.doUp = function() {player.move(0, -rate)}
      keyState.doDown = function() {player.move(0, rate)}
      keyState.doSpace = function() {player.shoot()}
    })();
  }, 100);

  showScore(score);
  showAmmo(player.ammo);
  showLives(player.lives);

  endLoop = false;
  loopCount = 0;
  player.dead = false;

  activeLoop = requestAnimationFrame(gameLoop);
}

function gameLoop(tFrame) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (endLoop) {
    cancelAnimationFrame(activeLoop);
  } else {
    requestAnimationFrame(gameLoop);
    //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
  //
  //Warm-up/Intro
  if (loopCount < 120) {
    if (loopCount % 30 > 15) {
      write2screen(ctx, "center", 226, "Get Ready!", 2);
    }
    if (loopCount % 4 > 2) {
      player.update(loopCount);
    }
  } else {
    player.update(loopCount);
  }

  keyState.update();
  shots.forEach(x => {
    if (x.y < 0) {
      shots.shift();
    } else {
      x.draw(player.x, player.y);
      //console.log(x.x, x.y, x.w, x.h);
    }
  });
  if (loopCount % 30 === 0 && loopCount > 120) {
    if (enemies.length < 7) {
      if (rnd(1, 100) % 2 === 0) {
        makeEnemy("ray");
      } else {
        makeEnemy("ring");
      }
    }
  }
  enemies.forEach((x, i) => x.update(x.x, x.y, i, loopCount));

  //console.log(tFrame);
  loopCount++;
}

function gameOverInit() {
  endLoop = false;
  loopCount = 0;
  keyState = new KeyState;
  keyState.doSpace = function() {
    endLoop = true;
  }

  activeLoop = requestAnimationFrame(gameOverLoop);
}

function gameOverLoop(tFrame) {
  if (endLoop) {
    cancelAnimationFrame(activeLoop);
    statCtx.clearRect(0, 0, 720, 32);
    setTimeout(function() {
      newGameInit();
    }, 100);
  } else {
    requestAnimationFrame(gameOverLoop);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (loopCount % 60 > 30) {
    write2screen(ctx, "center", 220, "Play Again?", 2);
  }
  write2screen(ctx, "center", 240, "Press Space");
  keyState.update();
  loopCount++;
}
