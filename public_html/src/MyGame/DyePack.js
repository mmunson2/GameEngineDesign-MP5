/******************************************************************************** 
 * DyePack Class
 * 
 * Size: 2.3 x 3.25
 * 
 * Behavior:
 * • Travel at a constant speed in the positive X direction
 *      • 120 units per second
 *      • If the D key is pressed, deaccelerates at a rate of 0.1 unit/frame
 *      • NOTE: NOT constant deacceleration
 *      • EXTRA: slow down if colliding with Patrol
 * • Hit: When a pixel collides with a Patrol, oscillate:
 *      • X amplitude: 4 | Y amplitude: 0.2
 *      • Frequency 20
 *      • Duration: 300 frames
 * • Lifespan: Maximum is 5 seconds
 *      • Destroyed if outside the world bound
 *      • Destroyed if the speed is less than 0
 *      • Destroyed after Hit
 * 
 * Input:
 * • D Key: Triggers deacceleration
 * • S Key: Triggers a hit event for all DyePacks
 * 
 * 
 ********************************************************************************/


function DyePack( dyePackTexture, positionX, positionY, worldWidth )
{
    this.isDeaccelerating = false;
    
    
    this.positionX = positionX;
    this.positionY = positionY;
    
    this.velocityX = 2;
    this.velocityY = 0;
    
    this.accelerationX = 0;
    this.accelerationY = 0;
    
    this.worldWidth = worldWidth;
    
    
    this.texture = dyePackTexture;
    this.spriteRenderable = null;
    
    this.isAlive = true;
    
    
    //Initialization 
    this.spriteRenderable = new SpriteRenderable(this.texture);
    
    this.spriteRenderable.setElementUVCoordinate(510 / 1024, 594 / 1024, 
    (512 - 488) / 512, (512 - 360) / 512);
    
    
    this.spriteRenderable.getXform().setPosition(this.positionX, this.positionY);
    
    this.spriteRenderable.getXform().setSize(2.3, 3.25);
    
    this.spriteRenderable.getXform().setRotationInDegree(90);
    
    
    this.frameCounter = 0;
    
    
    this.shaker = null;
}

/*
DyePack.prototype.initialize = function ()
{
    this.spriteRenderable = new SpriteRenderable(this.texture);
    
    this.spriteRenderable.setElementUVCoordinate(0.5, 0.6, 0, 0.2);
    
    this.spriteRenderable.getXform().setPosition(50, 50);
    
    
    
};
*/

DyePack.prototype.isDead = function ()
{
    if (this.shaker !== null && this.shaker.shakeDone()) return true;
    
    if (this.frameCounter >= 5 * 60) return true;
        
    if (this.positionX > this.worldWidth / 2) return true;
    
    if (this.shaker === null && this.velocityX <= 0) return true;

};

DyePack.prototype.draw = function ( camera )
{
    this.spriteRenderable.draw( camera );
    
};

DyePack.prototype.update = function ()
{
    this._checkInput();
    
    if(this.isDeaccelerating && this.velocityX > 0)
    {
        this.velocityX -= 0.1; 
        //this.velocityX *= 0.9;
    }
    

    this.velocityX += this.accelerationX;
    this.velocityY += this.accelerationY;
    
    if(this.velocityX < 0)
    {
        this.velocityX = 0;
    }
    
    
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;
    
    
    //Shake test
   
        if(this.shaker !== null && !this.shaker.shakeDone())
        {
            var result = this.shaker.getShakeResults();

            //this.positionX += result[0];
            //this.positionY += result[1];

            this.spriteRenderable.getXform().setPosition(this.positionX + result[0], this.positionY + result[1]);

        }
        else
        {
            this.spriteRenderable.getXform().setPosition(this.positionX, this.positionY);
        }
    
    
    
    
    this.frameCounter++;
    
};


//_______________________________________________________________________________
//Private Methods



DyePack.prototype._checkInput = function ()
{    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.D))
    {
        this.isDeaccelerating = true;
    }
    
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.S))
    {
        this.shaker = new ShakePosition(4, 0.2, 20, 300);
        this.velocityX = 0;
        this.velocityY = 0;
    }
    
};

DyePack.prototype._checkRemove = function ()
{

    
    
    
};




DyePack.prototype._hit = function ()
{
    
    
    
    
};



