var Tree = function(game, x, y, group, options) {
 Phaser.Sprite.call(this, game,x,y,'tree');
 this.anchor.setTo(0.5,0.5);
 this.group = trees;

 this.alpha = treeTransparency;
};

Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

var addTree = function(x,y)
{
    var tree = trees.getFirstDead();
    
    if(tree == null)
    {
        tree = new Tree(game, game.world.randomX, game.world.randomY);
        trees.add(tree);
    }
    
    tree.revive();
    
    tree.x=x;
    tree.y=y;
    
    return tree;
}
