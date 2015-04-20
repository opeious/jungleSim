function timeUpdate()
{
   // timer.loop(1000/timeRate, addSeconds, this);
    
    if(currSe>59)
    {
        currSe=0;
        currMi++;
    }
    if(currMi>59)
    {
        currHr++;
        currMi=0;
        
    }
    if(currHr>23)
    {
        currHr=0;
    
    boids.forEach(function(boid){
    if(!boid.alive)    
     return;
    boid.hunger-=10;              
    console.log(boid.hunger);
    },this);
    
    }
}

function addSeconds()
{
    currSe++;
    
    var i = ran.between(0,foodSpawnRate);
    if(currMi==i)
    {
        var j = ran.between(0,treeCount-1);
        var treeSpawner = trees.getAt(j);
        
        var xRan;
        xRan=128*treeScale/2;
        addFood(treeSpawner.x+ran.between(-xRan,xRan),treeSpawner.y+ran.between(-xRan,xRan));
        
        foods.setAll('scale.x',treeScale/16);
        foods.setAll('scale.y',treeScale/16);
        
        //add bounds to spawners
    }
}

function timeStart()
{
    //  Create our Timer
    timer = game.time.create(false);

    //  Set a TimerEvent to occur after 2 seconds
    
    timer.loop(1000/timeRate, addSeconds, this);
    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();
}

function timeRender()
{
     if(currMi>9)
    game.debug.text(currHr+':' +currMi,746, 20);
 else
    game.debug.text(currHr+':0' +currMi,746, 20);
}