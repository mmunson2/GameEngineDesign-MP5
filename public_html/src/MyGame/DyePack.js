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


function DyePack()
{
    this.isDeaccelerating = false;
    
    this.velocityX = 0;
    this.velocityY = 0;
    
    this.accelerationX = 0;
    this.accelerationY = 0;
    
    this.spriteTexture = null;
    
    gEngine.Textures.loadTexture(this.spriteSheet);
}

DyePack.prototype.draw = function (camera)
{
    
    
};

DyePack.prototype.update = function ()
{
    this._checkInput();
    
    
    
    this.velocityX += this.accelerationX;
    this.velocityY += this.accelerationY;
    
    
    
};


//_______________________________________________________________________________
//Private Methods


DyePack.prototype._checkInput = function ()
{
    if(gEngine.Input.isButtonPressed(gEngine.Input.D))
    {
        this.isDeaccelerating = true;
    }
    
    if(gEngine.Input.isButtonPressed(gEngine.Input.S))
    {
        //Trigger a Hit event
    }
    
};

