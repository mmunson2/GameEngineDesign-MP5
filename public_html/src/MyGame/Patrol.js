/******************************************************************************** 
 * Patrol Class
 ********************************************************************************/

function Patrol( spriteSheet, positionX, positionY, velocityX, velocityY, worldWidth)
{
    this.spriteSheet = spriteSheet;
    
    this.positionX = positionX;
    this.positionY = positionY;
    
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    
    this.worldWidth = worldWidth;
    this.worldHeight = worldWidth / 1.3333;
    
    this.boundingBox = [0, 0, 0, 0];
    
    
    //Create the head - the leader of the patrol (not animated)
    this.head = new SpriteRenderable(this.spriteSheet); 
    this.head.setElementUVCoordinate(157 / 1024, 286 / 1024, (512 - 509) / 512, (512 - 334) / 512);
    this.head.getXform().setPosition(this.positionX, this.positionY);
    this.head.getXform().setSize(7.5, 7.5);
    
    
    this.top = new SpriteAnimateRenderable(this.spriteSheet);
        
    this.top.getXform().setPosition(this.positionX + 10, this.positionY + 6);
    this.top.getXform().setSize(10, 8);
    
    //this.top.setSpriteSequence(300, 0, 204, 164, 5, 0);
    this.top.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.top.setAnimationSpeed(15);
    
    
    this.bottom = new SpriteAnimateRenderable(this.spriteSheet);
        
    this.bottom.getXform().setPosition(this.positionX + 10, this.positionY - 6);
    this.bottom.getXform().setSize(10, 8);
    
    //this.top.setSpriteSequence(300, 0, 204, 164, 5, 0);
    this.bottom.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.bottom.setAnimationSpeed(15);
    
    

    this.interpolateTopX = new Interpolate(0, 120, 0.05);
    this.interpolateTopY = new Interpolate(0, 120, 0.05);
    
    this.interpolateBottomX = new Interpolate(0, 120, 0.05);
    this.interpolateBottomY = new Interpolate(0, 120, 0.05);

    this.testCounter1 = 0;
}

Patrol.prototype.draw = function ( camera )
{
    this.head.draw(camera);
    
    this.top.draw( camera );
    
    this.bottom.draw( camera );
};


Patrol.prototype.update = function ()
{
    this.top.updateAnimation();
    this.bottom.updateAnimation();
    
    if(this.testCounter1 === 0)
    {
        this.top.setSpriteSequence(512, 0, 204, 160, 5, 0);
        this.bottom.setSpriteSequence(512 - 164, 0, 204, 160, 5, 0);
        this.testCounter1++;
    }
    
    
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;
    
    
    this.head.getXform().setPosition(this.positionX, this.positionY);
    
    this.interpolateTopX.setFinalValue(this.positionX + 10);
    this.interpolateTopY.setFinalValue(this.positionY + 6);
    this.interpolateBottomX.setFinalValue(this.positionX + 10);
    this.interpolateBottomY.setFinalValue(this.positionY - 6);
    
    
    this.interpolateTopX.updateInterpolation();
    this.interpolateTopY.updateInterpolation();
    this.interpolateBottomX.updateInterpolation();
    this.interpolateBottomY.updateInterpolation();
    
    
    this.top.getXform().setPosition(this.interpolateTopX.getValue(), this.interpolateTopY.getValue());
    this.bottom.getXform().setPosition(this.interpolateBottomX.getValue(), this.interpolateBottomY.getValue());
    
    
    //Top Bound
    this.boundingBox[0] = this.interpolateTopY.getValue() + 8/2;
    
    //Bottom Bound
    this.boundingBox[1] = this.interpolateBottomY.getValue() - 8/2;
    
    //Left Bound
    this.boundingBox[2] = this.positionX - 7.5 / 2;
    
    //Right Bound
    this.boundingBox[3] = this.interpolateTopX.getValue() + 10/2;
    
    console.log("Top: " + this.boundingBox[0]);
    console.log("Bottom: " + this.boundingBox[1]);
    console.log("Left: " + this.boundingBox[2]);
    console.log("Right: " + this.boundingBox[3]);
    
    
    
    this.checkBounds();
};


Patrol.prototype.checkBounds = function ()
{
    //Check collision with world top
    if(this.boundingBox[0] > this.worldHeight / 2)
    {
        if(this.velocityY > 0)
        {
            this.velocityY *= -1;
        }
    }
    //Check collision with world bottom
    if(this.boundingBox[1] < this.worldHeight / -2)
    {
        if(this.velocityY < 0)
        {
            this.velocityY *= -1;
        }
    }
    //Check collision with world left
    if(this.boundingBox[2] < this.worldWidth / -2)
    {
        if(this.velocityX < 0)
        {
            this.velocityX *= -1;
        }
    }
    //Check collision with world right
    if(this.boundingBox[3] > this.worldWidth / 2)
    {
        if(this.velocityX > 0)
        {
            this.velocityX *= -1;
        }
    } 
}

