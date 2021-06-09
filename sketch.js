// Game States
var PLAY = 1;
var END = 2;
var WIN = 3;
var gameState  = PLAY;

// creating variables for monkey
var monkey, monkey2, monkey_running, monkeyI, monkey_jumping;

var back, back1, youWin, gameOver, rest, youWinSound,  firingSound, invisibleGround ,V, wall, w2;
// creating Image variables
var bananaImage, fireImage, gameOverIMG, resetImage, youWinIMG, groundImage, backIMG, uFireImage, grImage;
 // creating group variables
var foodsGroup, firesGroup, backGroup, groundGroup, uFireGroup;
var score, ST, W, H;
var r = 1;
var n = 1;


function preload(){
  
  
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png",
  "sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkey_jumping = loadAnimation("sprite_8.png");
  
  bananaImage = loadImage("banana.png");
  grImage = loadImage("upground.png")
  uFireImage = loadImage("ufire.png");
  fireImage = loadImage("fire.png");
  groundImage = loadImage("ground.png");
  gameOverIMG = loadImage("gameOver.png");
  resetImage = loadImage("reset.png");
  youWinIMG = loadImage("win.gif");
  backIMG = loadImage("back.jpg");
  monkeyI = loadImage("monkey.gif")

  firingSound = loadSound("fire.wav");
  youWinSound = loadSound("youwin.mp3");

}



function setup() {
  
  W = windowWidth;
  H = windowHeight;
  createCanvas(W,H)
  
  score = 29;
  ST = 0;
  
  //crating monkey
  monkey = createSprite(80, H - 126, 20, 20);
  monkey.addAnimation("walking", monkey_running);
  monkey.addAnimation("jumping", monkey_jumping);
  monkey.scale = 0.12;
  monkey.setCollider("rectangle",0,0,monkey.hight,monkey.width);

  w2 = createSprite(W/4.2,H/2,10,H);
  w2.visible = false;
  
  invisibleGround = createSprite(W/2,H/1.2,W,20);
  invisibleGround.visible = false;

  youWin = createSprite(W/3.5,H/2,20,20);
  youWin.addImage(youWinIMG);
  youWin.scale = 1.4;
  youWin.visible = false;
  
  gameOver = createSprite(W/2,H/3,20,20);
  gameOver.addImage(gameOverIMG);
  gameOver.scale = 0.1;
  gameOver.visible = false;
  
  reset = createSprite(W/2,gameOver.y+60,20,20);
  reset.addImage(resetImage);
  reset.scale = 0.3;
  reset.visible = false;
  
  backGroup = createGroup();
  groundGroup = createGroup();
  foodsGroup = createGroup();
  firesGroup = createGroup();
  uFireGroup = createGroup();

  gr();
  
  back = createSprite(W/2,H/2,20,20);
  back.addImage(backIMG);
  back.depth = monkey.depth - 2;
  back.scale = 1.7;
  backGroup.add(back);
  
  back1 = createSprite(W,H/2,20,20);
  back1.addImage(backIMG);
  back1.depth = monkey.depth - 2;
  back1.scale = 1.7;
  backGroup.add(back1);
  
  wall = createSprite(W-60,H/2,10,H);
  wall.visible = false;
  
}


function draw() {
  background("skyblue");
  
  if (back.x < -682) {
    back.x = W/2;
    
  } if (back1.x < W/2+1) {
    back1.x = W;
  }
  
  
  if (gameState === PLAY) {
    
    
if (monkey.isTouching(invisibleGround)) {
      
    monkey.changeAnimation("walking", monkey_running);
    monkey.collide(invisibleGround);
  
  if(keyDown("space") || touches.length > 0) {
      monkey.velocityY = -19; 
      monkey.changeAnimation("jumping",monkey_jumping);
    }
  }
    
    monkey.velocityY = monkey.velocityY + 0.9;
    
    spawnFire();
    spawnUFire();
    spawnFood();
    spawnGround();
    //spawnUGround();
    
    if (foodsGroup.isTouching(monkey)) {
      foodsGroup[0].destroy();
      score++;
    }
    
    ST = ST + Math.round(frameRate()/31);
    V = -(8 + score/8);
    back.velocityX = V;
    back1.velocityX = V;
    
    if (firesGroup.isTouching(monkey)) {
      gameState = END;

    } else if (uFireGroup.isTouching(monkey)) {
      gameState = END;
    }
    
    if (score >= 30) {
      gameState = WIN;
    }

    if (uFireGroup.isTouching(w2)) {
      uFireGroup[0].velocityY = (4 + score/10);
    }
    
  } else if (gameState === END) {
    game();
    gameOver.visible = true;
    reset.visible = true;
    monkey.visible = false;
    
    if (r  === 1) {
      firingSound.play();
      r = 2;
    }
    
    if (mousePressedOver(reset) || touches.length > reset.x - reset.width/2 &&
    touches.length < reset.x + reset.width/2 && touches.width > reset.y - reset.heigth/2
    && touches.width < reset.y + reset.heigth/2) {

      restart();
    }
    
  } else if (gameState === WIN) {
    youWin.visible = true;
    
    if (n === 1) {
      monkey1 = createSprite (monkey.x,monkey.y,monkey.width,monkey.height);
      monkey1.addImage(monkeyI);
      monkey1.setCollider ("rectangle",0,0,monkey1.width,monkey1.height);
      monkey.visible = false;
      youWinSound.play();
    }
    monkey1.velocityY = 3.4;
    monkey1.velocityX = 5;
    
    if (monkey1.isTouching(wall)) {
      monkey1.velocityY = 0;
      monkey1.velocityX = 0;
    }
    monkey1.collide(invisibleGround);
    groundGroup.collide(monkey);
    
    game();
    restart();
  }
   
  drawSprites();
  textSize(17);
  fill("black");
  text("Survival Time: "+ ST, H/5,50);
  text("Score: "+score,W/1.2,50);
}
  

function spawnFood(){
  if (frameCount % 70 === 0) {
    var food =  createSprite(W,Math.round(random(H/1.8,H/2.55)),20,20);
    food.addImage(bananaImage);
    food.velocityX = V;
    food.scale = 0.1;
    food.lifetime = 300;
    
    //adding food in Group
    foodsGroup.add(food);
  }
}

function restart() {
  firesGroup.destroyEach();
  foodsGroup.destroyEach();
  groundGroup.destroyEach();
  uFireGroup.destroyEach();
  gameOver.visible = false;
  reset.visible = false;
  gr();
  n = 2;
  
  if (gameState === END) {
    monkey.visible = true;
    score = 0;
    ST = 0;
    r = 1;
    gameState = PLAY;
    
  }
}

function game() {
    firesGroup.setLifetimeEach(-1);
    foodsGroup.setLifetimeEach(-1);
    groundGroup.setLifetimeEach(-1);
    firesGroup.setVelocityXEach(0);
    foodsGroup.setVelocityXEach(0);
    groundGroup.setVelocityXEach(0);
    monkey.changeAnimation("jumping", monkey_jumping); 
    monkey.velocityY = 0;
    back.velocityX = 0;
    back1.velocityX = 0;
}

function spawnGround () {
  if (frameCount % 40 === 0) {
    var ground = createSprite(W+311,H/1.1,20,20);
    ground.addImage(groundImage);
    ground.velocityX = V;
    ground.lifetime = 300;
    ground.scale = 0.15;
    
    groundGroup.add(ground);
  }
}

function gr() {
  for (var i = 312;i < 1557;i = i + 622) {
    var ground = createSprite(i,H/1.1,20,20);
    ground.addImage(groundImage);
    ground.scale = 0.15;
    ground.velocityX = -(8 + score/8);
    ground.lifetime = 300;
    
    groundGroup.add(ground);
  }
}

function spawnFire() {
  if (frameCount % 160 === 0) {
    var fire = createSprite(W + 20,invisibleGround.y-72,20,20);
    fire.addImage(fireImage);
    fire.velocityX = V;
    fire.setCollider("circle",0,0,fire.width/2-28);
    fire.scale = 0.6;
    fire.depth = monkey.depth -1;
    fire.lifetime = 300;
    
    //adding fire in Group
    firesGroup.add(fire);
  }
}

function spawnUFire() {
  if (frameCount % 220 === 0) {
    var uFire = createSprite(W + 20,13,20,20);
    uFire.addImage(uFireImage);
    uFire.velocityX = -(26 + score/10);
    uFire.velocityY = (9 + score/10);
    uFire.setCollider("circle",0,0,uFire.width/2);
    uFire.scale = 0.3;
    uFire.depth = monkey.depth -1;
    uFire.lifetime = 200;
    
    //adding up fire in Group
    uFireGroup.add(uFire);
  }
}

function spawnUGround() {
  if (frameCount % 320 === 0) {
    var ground = createSprite(W,Math.round(random(H/1.8,H/2)),20,20);
    ground.addImage(grImage);
    ground.velocityX = -10;
    ground.scale = 0.03;
    ground.setCollider("rectangle",0,0,ground.width,ground.height-80)

    groundGroup.add(ground);
  }
}
