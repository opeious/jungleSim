var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update, render: render  });

var currHr,currMi,currSe;
var timeRate=10;   //increase to speed time

var targoot;
var boids;
var mySpScale = 0.4;

var trees;
var treeCount=5;
var treeScale = 0.9;
var treeTransparency = 0.65;

var foodSpawnRate = 59;  //60 is min, increasing will decrease spawn rate (exponentially)
var foods;

var ran = new Phaser.RandomDataGenerator;

function preload() {
   game.load.image('boid', '../img/mySp1.png');
   game.load.image('tree', '../img/tree.png');
   game.load.image('food', '../img/food.png');
}

function create() {
    
    boids = game.add.group();
    foods = game.add.group();
    trees = game.add.group();
    
    
    targoot = new Phaser.Sprite;
    targoot.x=10;
    targoot.y=10;
    
    currHr=13;
    currSe=0;
    currMi=30;              //time init
    timeStart();

    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(10, 10, '',       //fps tracking
    { font: '8px Arial', fill: '#ffffff' });
    
    while(trees.countLiving()<treeCount)
    {
        addTree(game.world.randomX,game.world.randomY);
    }
    trees.setAll('scale.x',treeScale);
    trees.setAll('scale.y',treeScale);
    
    /*
    for(var i=0;i<5;i++)
    {
        addFood(game.world.randomX,game.world.randomY);
    }

    */
    
    updateValues();    // call default slider value functions
}

function update()
{
    
    timeUpdate();    
    
    
     if(slider2Val==0){
         targoot.x = this.game.width/2;
         targoot.y = this.game.height/2;
    }
    else
    {
         targoot.x = game.input.x;
         targoot.y = game.input.y;
        
    }
    
    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');   //update fps tracker
    }
    
    game.physics.arcade.overlap(foods, boids, foodHit, null, this);
    //this.game.physics.arcade.collide(foods, boids, foodHit());
}

function render()
{
 timeRender();
}

