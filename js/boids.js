var addBoid = function(x,y)
{
    var boid = boids.getFirstDead();
    
    if(boid == null)
    {
        boid = new Boid(game, game.world.randomX, game.world.randomY, boids);
        boids.add(boid);
    }
    
    boid.revive();
    
    boid.x = x;
    boid.y = y;
    boid.body.collideWorldBounds = true;
    return boid;
}

var Boid = function(game, x, y, group, options) {
  Phaser.Sprite.call(this, game, x, y, 'boid');
  this.anchor.setTo(0.5, 0.5);
  this.group = boids;
  this.game.physics.enable(this, Phaser.Physics.ARCADE);

  this.currentState = 1;                                     // 0 idle, 1 herd, 2 look for food  
    
    
  this.hunger=ran.between(8,20);    
    
  this.maxVelocity = 50.0;
  this.maxForce = 10.0;
  this.seekForce = 0.5;
  
  this.radius = Math.sqrt(this.height * this.height + this.width * this.width) / 2;

  this.desiredSeparation = 20.0;
  this.maxDistance = this.radius * 10.0;
  
  this.target = new Phaser.Sprite;
  this.target.alive = true;
};

Boid.prototype = Object.create(Phaser.Sprite.prototype);
Boid.prototype.constructor = Boid;

Boid.prototype.update = function() {
  
  if(this.hunger==0&&this.alive)
  {
      this.kill();
      console.log("Boid died due to hunger.");
  }
    
  this.currentState=1; 
  this.target = targoot;    
    
  if(this.hunger<10)
  {
   this.currentState=2;
   var closestFood = new Phaser.Sprite;
   var dist = 10000;
   
   foods.forEach(function(food) {
    var distBetween = this.game.physics.arcade.distanceBetween(this, food);
    if(distBetween < dist)
    {dist = distBetween;
       this.target = food;}
       
   },this);  
  }
    
  

  this.body.acceleration.setTo(0,0);
  if(this.target && this.target.exists) {
    var seekAccel = Phaser.Point();
    if(this.target instanceof Phaser.Group) {
      seekAccel = this.seekGroup();
    } else {
      seekAccel = this.seek(this.target.position);
    }
    seekAccel.multiply(this.seekForce, this.seekForce);
    this.applyForce(seekAccel);
  }
  this.applyForce(this.separate());
  this.applyForce(this.align());
  this.cohesion();
  
  this.checkBorders();
  this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);

    
    
};


Boid.prototype.applyForce = function(force) {
  this.body.acceleration = Phaser.Point.add(this.body.acceleration, force);
};

Boid.prototype.seekGroup = function(targetGroup) {

  var closest = null;
  var distance = Number.MAX_VALUE;
  targetGroup = targetGroup || this.target;
  targetGroup.forEachExists(function(target) {
    var d = this.body.position.distance(target.body.position);
    if(d < distance) {
      distance = d;
      closest = target;
    }
  }, this);
  if(closest) {
    return this.seek(closest.body.position);  
  }
  return new Phaser.Point();
};

Boid.prototype.seek = function(target) {
  var desired = Phaser.Point.subtract(target, this.body.position);

  desired.normalize();
  desired.multiply(this.maxVelocity, this.maxVelocity);

  var steer = Phaser.Point.subtract(desired, this.body.velocity);
  
  if(steer.x>this.maxVelocity)
      steer.x=this.maxVelocity;
  if(steer.y>this.maxVelocity)
      steer.y=this.maxVelocity;
  return steer;
};

Boid.prototype.lookAtClosest = function() {
  var target = null;
  var dist = 0;
  this.group.forEach(function(boid) {
    if (boid.body.position !== this.body.position) {
      var distBetween = this.game.physics.arcade.distanceBetween(this, boid);
      if(!target ||  distBetween < dist) {
        dist = distBetween;
        target = boid;
      }
    }
  },this);

  if(!!target) {
    this.rotation = this.game.physics.arcade.angleBetween(this, target);
  }
};

Boid.prototype.separate = function() {
  var distance = new Phaser.Point();
  var steer = new Phaser.Point();
  var count = 0;

  this.group.forEach(function(bod) {
    var d = this.body.position.distance(bod.body.position);
    if((d > 0) && (d < this.desiredSeparation)) {
      var diff = Phaser.Point.subtract(this.body.position, bod.body.position);
      diff.normalize();
      diff.divide(d,d);
      steer.add(diff.x,diff.y);
      count++;
    }
  }, this);

  if(count > 0) {
    steer.divide(count, count);
  }

  if(steer.getMagnitude() > 0) {
    steer.normalize();
    steer.multiply(this.maxVelocity, this.maxVelocity);
    steer.subtract(this.body.velocity.x, this.body.velocity.y);
    
      
    if(steer.x>this.maxForce)
        steer.x=this.maxForce;
    if(steer.y>this.maxForce)
        steer.y=this.maxForce;
    
    
  }

  return steer;
};


Boid.prototype.cohesion = function() {
  
  var sum = new Phaser.Point();
  var steer = new Phaser.Point();
  var count = 0;

  this.group.forEach(function(boid) {
    var d = this.body.position.distance(boid.body.position);
    if ((d > 0) && d < this.maxDistance) {
      sum.add(boid.body.position.x, boid.body.position.y);
      count++;
    }
  }, this);

  if (count > 0) {
    sum.divide(count, count);  
    return this.seek(sum);
  }
  return steer;
};


Boid.prototype.align = function() {
  var sum = new Phaser.Point();
  var steer = new Phaser.Point();
  var count = 0;
  this.group.forEach(function(boid) {
    var d = this.body.position.distance(boid.body.position);
    if ((d > 0) && d < this.maxDistance) {
      sum.add(boid.body.velocity.x, boid.body.velocity.y);
      count++;
    }
  }, this);

  if (count > 0) {
    sum.divide(count, count);  

    sum.normalize();
    sum.multiply(this.maxVelocity, this.maxVelocity);
    steer = Phaser.Point.subtract(sum, this.body.velocity);
    
          if(steer.x>this.maxForce)
        steer.x=this.maxForce;
    if(steer.y>this.maxForce)
        steer.y=this.maxForce;
    
     
  }

  return steer;
};

Boid.prototype.checkBorders = function() {
  if(this.body.position.x < -this.radius ){
    this.body.position.x = this.game.width + this.radius;
  }
  if(this.body.position.y < -this.radius ){
    this.body.position.y = this.game.height + this.radius;
  }
  if(this.body.position.x > this.game.width + this.radius ){
    this.body.position.x = -this.radius;
  }
  if(this.body.position.y > this.game.height + this.radius ){
    this.body.position.y = -this.radius;
  }
};
