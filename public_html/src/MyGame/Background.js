/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Background( skyTexture, mountainTexture, mountainsTexture, trees1Texture, trees2Texture)
{
    this.xPosition = 0;
    
    this.sky = new TextureRenderable(skyTexture);
    this.sky.getXform().setPosition(0, 0);
    this.sky.getXform().setHeight(200 / 1.333333);
    this.sky.getXform().setWidth(200);
    
    this.mountain = new TextureRenderable(mountainTexture);
    this.mountain.getXform().setPosition(100,-10);
    this.mountain.getXform().setHeight(200 / 1.33333);
    this.mountain.getXform().setWidth(200);
    
    this.mountains = new TextureRenderable(mountainsTexture);
    this.mountains.getXform().setPosition(100,-30);
    this.mountains.getXform().setHeight(200 / 1.33333);
    this.mountains.getXform().setWidth(200);
   
    this.trees1 = new TextureRenderable(trees1Texture);
    this.trees1.getXform().setPosition(100,-50);
    this.trees1.getXform().setHeight(100);
    this.trees1.getXform().setWidth(200);
    
    this.trees2 = new TextureRenderable(trees2Texture);
    this.trees2.getXform().setPosition(100,-50);
    this.trees2.getXform().setHeight(100);
    this.trees2.getXform().setWidth(200);
    
    
    
}


Background.prototype.draw = function ( camera )
{
    this.sky.draw(camera);
    
    this._wrapTexture(camera, this.mountain);
    
    this._wrapTexture(camera, this.mountains);
    
    this._wrapTexture(camera, this.trees1);
    
    this._wrapTexture(camera, this.trees2);
};

Background.prototype._wrapTexture = function (camera, renderable)
{
    renderable.draw(camera);
    
    var width = renderable.getXform().getWidth();
    var height = renderable.getXform().getHeight();
    
    var startX = renderable.getXform().getPosition()[0];
    var startY = renderable.getXform().getPosition()[1];
    
    var worldLeftBound = -200 / 2;
    var worldRightBound = 200 / 2;
    
    var currentX = startX;
    
    while(currentX - (width / 2) > worldLeftBound)
    {
        currentX -= width;
        
        renderable.getXform().setPosition(currentX, startY);
        
        renderable.draw(camera);
    }
    
    renderable.getXform().setPosition(startX, startY);
    
    currentX = startX;
    
    while(currentX + (width /2) < worldRightBound)
    {
        currentX += width;
        
        renderable.getXform().setPosition(currentX, startY);
        
        renderable.draw(camera);
    }
    
    renderable.getXform().setPosition(startX, startY);
};

Background.prototype.update = function ()
{
    this.mountain.getXform().setPosition(-this.xPosition / 10 % 200, 0);
    
    this.mountains.getXform().setPosition(-this.xPosition / 7 % 200, -30);
    
    this.trees1.getXform().setPosition(-this.xPosition / 4 % 200, -40);
    
    this.trees2.getXform().setPosition(-this.xPosition * 2 % 200, -24);
    
    this.xPosition++;
};