/******************************************************************************** 
 * PatrolSet
 ********************************************************************************/


function PatrolSet(spriteSheet, worldWidth)
{
    this.patrolArray = [];
    this.autoSpawn = false;
    this.waiting = false;
    this.remainingFrames = 0;
    
    this.spriteSheet = spriteSheet;
    
    this.worldWidth = worldWidth;
    this.worldHeight = worldWidth / 1.333333;
    
    
}

PatrolSet.prototype.draw = function (camera)
{
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        this.patrolArray[i].draw(camera);
    }
};

PatrolSet.prototype.update = function ()
{
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C))
    {
        this._spawnPatrol();
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P))
    {
        this.autoSpawn = !this.autoSpawn;
        this.waiting = false;
    }
    
    if (this.autoSpawn && !this.waiting)
    {
        this.remainingFrames = Math.random() * 60 + 120;
        this.waiting = true;
    }
    if (this.autoSpawn && this.remainingFrames > 0)
    {
        this.remainingFrames--;
    }
    if (this.autoSpawn && this.remainingFrames <= 0)
    {
        this.waiting = !this.waiting;
        this._spawnPatrol();
    }
    
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        this.patrolArray[i].update();
    }
    
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        if (this.patrolArray[i].isDead())
        {
            this.patrolArray.splice(i, 1);
            break;
        }
    }
};

PatrolSet.prototype._spawnPatrol = function()
{
    // 10/60 and 5/60
    var velocityX = ((Math.random() > 0.5) ? -1 : 1) * (Math.random() * 5 + 5) / 60;
    var velocityY = ((Math.random() > 0.5) ? -1 : 1) * (Math.random() * 5 + 5) / 60;
    patrol = new Patrol(this.spriteSheet, Math.random() * (this.worldWidth / 2), Math.random() * (this.worldHeight / 4) - this.worldHeight / 8, velocityX, velocityY, this.worldWidth);
    this.patrolArray.push(patrol);
};

PatrolSet.prototype._autoSpawn = function()
{
    
};
