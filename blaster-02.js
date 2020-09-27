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
let shotSound, deathSound, boostSound;
//
//Background Music buffers
let bgm1, bgmGain, bgmSource
//
//Game context
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
let activeLoop, loopCount;
//
//Arrays of things
let shots = [], keyDown = [], keyUp = [];

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

    fetch("audio/boost.mp3")
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        audioCtx.decodeAudioData(buffer, function(decodedData) {
          boostSound = decodedData;
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
    let gameCanvas = makeElement("canvas", "gameCanvas");
    document.body.appendChild(gameCanvas);
    gameCanvas.setAttribute("height", canvasHeight);
    gameCanvas.setAttribute("width", canvasWidth);
    //
    //Setting the context
    ctx = gameCanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    //
    //Load the primary sprite sheet
    let blastSheet = new Image();
    blastSheet.src = "spriteSheet.png";
    blastSheet.onload = function() {
      spriteSheet = makeElement("canvas", "spriteSheet");
      spriteSheet.setAttribute("width", 160);
      spriteSheet.setAttribute("height", 64);
      let spriteSheetCtx = spriteSheet.getContext("2d");
      spriteSheetCtx.drawImage(blastSheet, 0, 0, 160, 64);
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

function write2screen(xPos, yPos, string, size = 1) {
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
    if (this.count < 2) {
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
    //integer-> sprite: index of the current sprite in  //
    //  the animation                                   //
    //--------------------------------------------------//

    this.x = x;
    this.y = y;
    this.w = 32;
    this.h - 32;
    this.sprites;
    this.sprite = 0;
    this.currentAnimation = this.sprites;
  }

  currentSprite(num) {
    return this.currentAnimation[num % this.currentAnimation.length];
  }

  /*get sprite() {
    return this.sprite % this.currentAnimation.length;
  }*/

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

}

class Player extends Ship {
  //----------------------------------------------------//
  //A sub-class for the player's ship                   //
  //----------------------------------------------------//

  constructor(x, y) {
    super(x, y);
    this.w = 32;
    this.h = 27;
    this.sprites = [new Sprite(0, 0, 32, 32),
                    new Sprite(32, 0, 32, 32),
                    new Sprite(64, 0, 32, 32),
                    new Sprite(32, 0, 32, 32)];
    this.fire = [new Sprite(0, 32, 32, 32),
                  new Sprite(32, 32, 32, 32),
                  new Sprite(64, 32, 32, 32),
                  new Sprite(96, 32, 32, 32)];
    this.currentAnimation = this.sprites;
    this.queuedAction = null;
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
          this.sprite % this.currentAnimation.length === this.currentAnimation.length - 1) {
            this.currentAnimation = this.sprites;
            this.queuedAction();
            this.queuedAction = null;
          }
      this.sprite++;

    }
    this.draw(this.x, this.y);
  }

  move(x, y) {
    //--------------------------------------------------//
    //Updates the ship's position and prevents it from  //
    //  leaving the bounds of the <canvas>              //
    //--------------------------------------------------//
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

  shoot() {
    this.currentAnimation = this.fire;
    this.queuedAction = function() {
      playSfx(shotSound);
      let newShot = new Shot();
      shots.push(newShot);
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
    //----------------------------------------------------//
    //Listens for a key to be pressed down                //
    //----------------------------------------------------//
    //event-> event: the key down event                   //
    //----------------------------------------------------//

    //console.log("press");
    if (event.code === "ArrowUp") keyState.up = true;
    if (event.code === "ArrowDown") keyState.down = true;
    if (event.code === "ArrowLeft") keyState.left = true;
    if (event.code === "ArrowRight") keyState.right = true;
    if (event.code === "Space" ) keyState.space = true;
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

let player = new Player(346, 226);

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
  loopCount = 0;
  keyState = new KeyState;
  keyState.onSpace = function() {gameInit()}

  activeLoop = requestAnimationFrame(newGameLoop);
}

function newGameLoop(tFrame) {
  if (false) {
    cancelAnimationFrame(activeLoop);
    gameInit();
  } else {
    requestAnimationFrame(newGameLoop);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (loopCount % 60 > 30) {
    write2screen("center", 220, "New Game", 2);
  }
  write2screen("center", 240, "Press Space");
  loopCount++;
}

function gameInit() {

  //
  //Assign key functions
  (function() {
    let rate = 6;
    keyState.doLeft = function() {player.move(-rate, 0)}
    keyState.doRight = function() {player.move(rate, 0)}
    keyState.doUp = function() {player.move(0, -rate)}
    keyState.doDown = function() {player.move(0, rate)}
    keyState.doSpace = function() {player.shoot()}
  })();

  loopCount = 0;

  activeLoop = requestAnimationFrame(gameLoop);
}

function gameLoop(tFrame) {
  /*if (tFrame > 1000) {
    cancelAnimationFrame(activeLoop);
  } else {*/
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  //}
  //ctx.drawImage(spriteSheet, ship1.x, ship1.y, ship1.w, ship1.h, loopCount * 4 % 720, 240, 32, 27);
  keyState.update();
  player.update(loopCount);
  shots.forEach(x => {
    if (x.y < 0) {
      shots.shift();
    } else {
      x.draw(player.x, player.y);
    }
  })

  //console.log(tFrame);
  loopCount++;
}
