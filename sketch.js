// Game States
var PLAY = 1;
var END = 2;
var WIN = 3;
var gameState  = PLAY;

var monkey, monkey2, monkey_running, monkeyI, V, wall, wall1, monkey_jumping, ground1, ground2, ground3, back, back1, backIMG, groundImage, groundIMG, youWin, youWinIMG, youWinSound;
var banana ,bananaImage, obstacle, obstacleImage, gameOver, gameOverIMG, gameOverSound, reset, resetImage;
var foodsGroup, obstaclesGroup;
var score, ST, W, H;
var r = 1

function preload(){
  
  
  monkey_running = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkey_jumping = loadAnimation("sprite_8.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  groundImage = loadImage("ground.png");
  gameOverIMG = loadImage("gameOver.png");
  resetImage = loadImage("reset.png");
  youWinIMG = loadImage("win.gif");
  backIMG = loadImage("back.jpg");
  groundIMG = loadImage("upground.jpg");
  monkeyI = loadImage("monkey.gif")

  gameOverSound = loadSound("gameover.mp3");
  youWinSound = loadSound("youwin.mp3");

}



function setup() {
  
  W = windowWidth;
  H = windowHeight;
  createCanvas(W,H)
  
  //crating monkey
  monkey = createSprite(80, H - 126, 20, 20);
  monkey.addAnimation("walking", monkey_running);
  monkey.addAnimation("jumping", monkey_jumping);
  monkey.scale = 0.1;
  monkey.setCollider("rectangle",0,0,monkey.hight,monkey.width);
  
  //creating ground
  ground1 = createSprite(312,H/1.1,20,20);
  ground1.addImage(groundImage);
  ground1.scale = 0.15;
  ground1.setCollider("rectangle",0,0, ground1.width,ground1.height-200);
  
  ground2 = createSprite(934,H/1.1,20,20);
  ground2.addImage(groundImage);
  ground2.scale = 0.15;
  ground2.setCollider("rectangle",0,0, ground2.width,ground2.height-200);
  
  ground3 = createSprite(1521,H/1.1,20,20);
  ground3.addImage(groundImage);
  ground3.scale = 0.15;
  ground3.setCollider("rectangle",0,0, ground3.width,ground3.height-200);

  youWin = createSprite(W/3,H/2,20,20);
  youWin.addImage(youWinIMG);
  youWin.scale = 1.4;
  youWin.visible = false;
  
  gameOver = createSprite(W/2,H/3,20,20);
  gameOver.addImage(gameOverIMG);
  gameOver.scale = 0.1;
  gameOver.visible = false;
  
  reset = createSprite(W/2,gameOver.y+60,20,20);
  reset.addImage(resetImage);
  reset.scale = 0.1;
  reset.visible = false;
  
  back = createSprite(W/2,H/2,20,20);
  back.addImage(backIMG);
  back.depth = monkey.depth - 2;
  back.scale = 1.7;
  
  back1 = createSprite(W,H/2,20,20);
  back1.addImage(backIMG);
  back1.depth = monkey.depth - 2;
  back1.scale = 1.7;
  
  wall = createSprite(W-30,H/2,10,H);
  wall.visible = false;
  
  wall1 = createSprite(50,H/2,10,H);
  wall1.visible = false;
  
  foodsGroup = createGroup();
  obstaclesGroup = createGroup();
  
  score = 0;
  ST = 0;
  
}


function draw() {
  background("skyblue");
  
  if (back.x < -682) {
    back.x = W/2;
    
  } if (back1.x < W/2+1) {
    back1.x = W;
  }
  
  
  if (gameState === PLAY) {
    
    if (ground1.x < -311) {
      ground1.x = 312;

    } if (ground2.x < 313) {
      ground2.x = 934;

    } if (ground3.x < 900) {
      ground3.x = 1521;
    }
    
    
if (monkey.isTouching(ground1) || monkey.isTouching(ground2) ||   monkey.isTouching(ground3)) {
      
    monkey.changeAnimation("walking", monkey_running);
    monkey.collide(ground1);
    monkey.collide(ground2);
    monkey.collide(ground3);
    monkey.collide(wall1);
  
  if(keyDown("space") || touches.length > 0) {
      monkey.velocityY = -19; 
      monkey.changeAnimation("jumping",monkey_jumping);
    }
  }
    
    monkey.velocityY = monkey.velocityY + 0.9;
    
    spawnObstacles();
    spawnFood();
    
    if (foodsGroup.isTouching(monkey)) {
      foodsGroup[0].destroy();
      score = score + 1;
    }
    
    ST = Math.round(frameCount/31);
    V = -(8 + score/8);
    ground1.velocityX = V;
    ground2.velocityX = V;
    ground3.velocityX = V;
    back.velocityX = V;
    back1.velocityX = V;
    
    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
    }
    
    if (score >= 30) {
      gameState = WIN;
    }
    
  } else if (gameState === END) {
    game();
    gameOver.visible = true;
    reset.visible = true;
    
    if (r  === 1) {
      gameOverSound.play();
      r = 2;
    }
    
    if (mousePressedOver(reset) || touches.length > 0) {
      restart();
    }
    
  } else if (gameState === WIN) {
    youWin.visible = true;
    monkey1 = createSprite (monkey.x,monkey.y,monkey.width,monkey.height);
    monkey1.addImage(monkeyI);
    youWin.depth = monkey1.depth +1;
    monkey.velocityY = monkey.velocityY + 0.9;
    monkey.velocityX = 4;
    monkey.collide(wall);
    monkey.collide(ground1);
    monkey.collide(ground2);
    monkey.collide(ground3);
    monkey.scale = 0.15;
    
    game();
    restart();
    gameState = WIN;
  }
   
  drawSprites();
  textSize(17);
  fill("black");
  text("Survival Time: "+ ST, H/5,50);
  text("Score: "+score,W/1.5,50);
  
   if (monkey.x < 0) {
     textSize(25);
     fill("red")
     text("Please reload this game",W/2,H/1.5);
     gameState = END;
  }
  
}
  

function spawnObstacles() {
  if (frameCount % 160 === 0) {
    var obstacle = createSprite(W,H-130,20,20);
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = V;
    obstacle.setCollider("circle",0,0,170)
    obstacle.scale = 0.2;
    obstacle.depth = monkey.depth -1;
    obstacle.lifetime = 150;
    
    //adding obstacle in Group
    obstaclesGroup.add(obstacle);
  }
}

function spawnFood(){
  if (frameCount % 70 === 0) {
    var food =  createSprite(W,Math.round(random(H/2,H/3)),20,20);
    food.addImage(bananaImage);
    food.velocityX = V;
    food.scale = 0.1;
    food.lifetime = 150;
    
    //adding food in Group
    foodsGroup.add(food);
  }
}

function restart() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  foodsGroup.destroyEach();
  gameOver.visible = false;
  reset.visible = false;
  score = 0;
  r = 1;
}

function game() {
    obstaclesGroup.setLifetimeEach(-1);
    foodsGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    foodsGroup.setVelocityXEach(0);
    monkey.changeAnimation("jumping", monkey_jumping); 
    monkey.velocityY = 0;
    ground1.velocityX = 0;
    ground2.velocityX = 0;
    ground3.velocityX = 0;
    back.velocityX = 0;
    back1.velocityX = 0;
}