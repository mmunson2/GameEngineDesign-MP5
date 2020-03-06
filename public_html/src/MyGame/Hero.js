/******************************************************************************** 
 * Hero Class
 ********************************************************************************/

// Camden

function Hero(spriteSheet)
{
    this.spriteSheet = spriteSheet;
    
    this.spriteRenderable = new SpriteRenderable(this.spriteSheet);
    this.spriteRenderable.setElementUVCoordinate(0, 122 / 1024, (512 - 509) / 512, (512 - 334) / 512);
    this.spriteRenderable.getXform().setPosition(-20, 0);
    this.spriteRenderable.getXform().setSize(9, 12);
    
    this.interpolateX = new Interpolate(0, 120, 0.5);
    this.interpolateY = new Interpolate(0, 120, 0.5);
    
    this.shaker = null;
}

Hero.prototype.getRenderable = function() {return this.spriteRenderable;};
Hero.prototype.isShaking = function() {return this.shaker !== null;};

Hero.prototype.draw = function (camera)
{
    this.spriteRenderable.draw(camera);
};

Hero.prototype.update = function ()
{
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.startShake();
    }
    
    if (this.shaker !== null && !this.shaker.shakeDone())
    {
        var result = this.shaker.getShakeResults();
        this.spriteRenderable.getXform().setSize(9 + result[0], 12 + result[0] * 1.333);
    }
    
    if (this.shaker !== null && this.shaker.shakeDone()) this.shaker = null;
    
    var targetX = (gEngine.Input.getMousePosX() / 800) * 200 - 100;
    var targetY = (gEngine.Input.getMousePosY() / 600) * 150 - 75;
    
    if (!(targetY > 75))
    {
        this.interpolateX.setFinalValue(targetX);
        this.interpolateY.setFinalValue(targetY);
    }
    
    this.interpolateX.updateInterpolation();
    this.interpolateY.updateInterpolation();
    
    this.spriteRenderable.getXform().setPosition(this.interpolateX.getValue(), this.interpolateY.getValue());
    
};

Hero.prototype.startShake = function()
{
    this.shaker = new ShakePosition(4.5, 6, 4, 60);
};

Hero.prototype.getHandPos = function()
{
    var x = this.spriteRenderable.getXform().getXPos();
    var y = this.spriteRenderable.getXform().getYPos();
    
    return [x + 4.5, y + 4];
};