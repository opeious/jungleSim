var Food = function(game, x, y, group, options)
{ 
 Phaser.Sprite.call(this,game,x,y,'food');
 this.anchor.setTo(0.5,0.5);
 this.group = foods;
 this.game.physics.enable(this, Phaser.Physics.ARCADE);
}

Food.prototype = Object.create(Phaser.Sprite.prototype);
Food.prototype.constructor = Food;

var addFood = function(x,y)
{
    var food = foods.getFirstDead();
    
    if(food == null)
    {
        food = new Food(game, game.world.randomX, game.world.randomY);
        foods.add(food);
    }
    
    food.revive();
    
    if(x<0)
        x=0;
    if(x>799)
        x=799;
    if(y<0)
        y=0;
    if(y>599)
        y=599;
    
    food.x=x;
    food.y=y;

    return food;
}

function foodHit(food,boid)
{
    food.kill();
    boid.hunger=100;
}