var labelSide = "right";
var slider1Val=$('#slider-input').val();
var slider2Val=$('#slider-input2').val();

$('#slider-input').change( function() {
    var val = $(this).val();
    var valRounded = Math.round( val * 10 ) / 10;
    var mid = $(this).attr('max')/2;
  
    $('#slider-label').text( valRounded );
  
    if(val > mid && labelSide == "right") {
        labelSide = "left";
        $('#slider-label').removeClass("isRight").addClass("isLeft");
    
    } else if(val <= mid && labelSide == "left") {
        labelSide = "right";
        $('#slider-label').removeClass("isLeft").addClass("isRight");
    }
    
    slider1Val = val;
    
    updateValues();
});


$('#slider-input2').change( function() {
    var val = $(this).val();
    var valRounded = Math.round( val * 10 ) / 10;
    var mid = $(this).attr('max')/2;
  
    $('#slider-labe2').text( valRounded );
  
    if(val > mid && labelSide == "right") {
        labelSide = "left";
        $('#slider-label').removeClass("isRight").addClass("isLeft");
    
    } else if(val <= mid && labelSide == "left") {
        labelSide = "right";
        $('#slider-label').removeClass("isLeft").addClass("isRight");
    }
    
    slider2Val = val;
    
    updateValues();
});


function updateValues()
{
     while(boids.countLiving()<slider1Val)
    {
        addBoid(game.world.randomX,game.world.randomY);
            boids.setAll('scale.x',mySpScale);
            boids.setAll('scale.y',mySpScale);
            boids.setAll('target',targoot);
    
    }
    while(boids.countLiving()>slider1Val){
        var a = boids.getFirstAlive();
        if(a)
         a.kill();
        
    }
};