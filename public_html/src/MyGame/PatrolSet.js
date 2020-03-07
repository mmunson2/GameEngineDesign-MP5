/******************************************************************************** 
 * PatrolSet
 ********************************************************************************/

// Camden

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
    
    // auto spawning stuff
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
    
    // updating
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        this.patrolArray[i].update();
    }
    
    // checking for dead patrols
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        if (this.patrolArray[i].isDead())
        {
            this.patrolArray.splice(i, 1);
            break;
        }
    }
    
    document.getElementById("num_patrols").innerHTML = this.patrolArray.length;
    document.getElementById("auto_spawn").innerHTML = this.autoSpawn;
};

PatrolSet.prototype.dyePackCollide = function(dyePack)
{
    if (this.patrolArray.length === 0) return false;

    var dyePackBox = dyePack.getRenderable().getBoundingBox();
    
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        if (!this.isNear(dyePackBox, this.patrolArray[i].getBoundingBox()))
        {
            continue;
        }
        dyePack.startDeac();
        if (!dyePack.isShaking() && this.isNear(dyePackBox, this.patrolArray[i].getHead().getBoundingBox()))
        {
            this.patrolArray[i].headCollision();
            dyePack.startShake();
            return true;
        }
        
        if (!dyePack.isShaking() && this.isNear(dyePackBox, this.patrolArray[i].getTop().getBoundingBox()))
        {
            this.patrolArray[i].topCollision();
            dyePack.startShake();
            return true;
        }
        
        if (!dyePack.isShaking() && this.isNear(dyePackBox, this.patrolArray[i].getBot().getBoundingBox()))
        {
            this.patrolArray[i].bottomCollision();
            dyePack.startShake();
            return true;
        }
    }
    
};

PatrolSet.prototype.heroCollide = function(hero)
{
    if (this.patrolArray.length === 0) return false;
    
    var heroBox = hero.getRenderable().getBoundingBox();
    
    for (var i = 0; i < this.patrolArray.length; i++)
    {
        if (!this.isNear(heroBox, this.patrolArray[i].getBoundingBox()))
        {
            continue;
        }
        
        if (!hero.isShaking() && this.isNear(heroBox, this.patrolArray[i].getHead().getBoundingBox()))
        {
            return true;
        }
    }
};

PatrolSet.prototype.isNear = function (boxA, boxB)
{
    //  checking top
    if (boxA[0] <= boxB[0] && boxA[0] >= boxB[1] && (( boxA[2] >= boxB[2] && boxA[2] <= boxB[3] ) || ( boxA[3] >= boxB[2] && boxA[3] <= boxB[3] ))) return true;
    
    //  checking bottom
    if (boxA[1] <= boxB[0] && boxA[1] >= boxB[1] && (( boxA[2] >= boxB[2] && boxA[2] <= boxB[3] ) || ( boxA[3] >= boxB[2] && boxA[3] <= boxB[3] ))) return true;
    
    //  checking left
    if (boxA[2] >= boxB[2] && boxA[2] <= boxB[3] && (( boxA[0] <= boxB[0] && boxA[0] >= boxB[1] ) || ( boxA[1] <= boxB[0] && boxA[1] >= boxB[1] ))) return true;
    
    //  checking right
    if (boxA[3] >= boxB[2] && boxA[3] <= boxB[3] && (( boxA[0] <= boxB[0] && boxA[0] >= boxB[1] ) || ( boxA[1] <= boxB[0] && boxA[1] >= boxB[1] ))) return true;
    
    // checking if one surrounds the other
    if (boxA[0] >= boxB[0] && boxA[1] <= boxB[1] && boxA[2] <= boxB[2] && boxA[3] >= boxB[3]) return true;
};

PatrolSet.prototype._spawnPatrol = function()
{
    // 10/60 and 5/60
    var velocityX = ((Math.random() > 0.5) ? -1 : 1) * (Math.random() * 5 + 5) / 60;
    var velocityY = ((Math.random() > 0.5) ? -1 : 1) * (Math.random() * 5 + 5) / 60;
    patrol = new Patrol(this.spriteSheet, Math.random() * (this.worldWidth / 2), Math.random() * (this.worldHeight / 4) - this.worldHeight / 8, velocityX, velocityY, this.worldWidth);
    this.patrolArray.push(patrol);
};
