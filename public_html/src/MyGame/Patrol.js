/******************************************************************************** 
 * Patrol Class
 ********************************************************************************/

function Patrol( spriteSheet, positionX, positionY, velocityX, velocityY, worldWidth, showBound)
{
    this.spriteSheet = spriteSheet;
    
    this.positionX = positionX;
    this.positionY = positionY;
    
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    
    this.worldWidth = worldWidth;
    this.worldHeight = worldWidth / 1.3333;
    
    this.boundingBox = [0, 0, 0, 0];
    
    this.showBound = showBound; 
    
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
    
    //this.top.setSpriteSequence(512, 0, 204, 164, 5, 0);
    this.bottom.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.bottom.setAnimationSpeed(15);
    
    
    this.topBound = [];
    this.bottomBound = [];
    this.headBound = [];
    this.patrolBound = [];
    
    this.topBound = this._updateBound(this.top);
    this.bottomBound = this._updateBound(this.bottom);
    this.headBound = this._updateBound(this.head);
    this._updatePatrolBound();
    
    
    this.interpolateTopX = new Interpolate(this.positionX, 120, 0.05);
    this.interpolateTopY = new Interpolate(this.positionY, 120, 0.05);
    
    this.interpolateBottomX = new Interpolate(this.positionX, 120, 0.05);
    this.interpolateBottomY = new Interpolate(this.positionY, 120, 0.05);

    this.testCounter1 = 0;
}

Patrol.prototype._updateBound = function( renderable)
{
    var boundArray = [];
    
    var xPos = renderable.getXform().getPosition()[0];
    var yPos = renderable.getXform().getPosition()[1];
    
    var height = renderable.getXform().getHeight();
    var width = renderable.getXform().getWidth();
    
    //Top left to top right (top bound)
    boundArray[0] = new LineRenderable(xPos - width / 2, yPos + height / 2, xPos + width / 2, yPos + height / 2);
    boundArray[0].setColor([1,1,1,1]);
    
    //Bottom left to bottom right (bottom bound)
    boundArray[1] = new LineRenderable(xPos - width / 2, yPos - height / 2, xPos + width / 2, yPos - height / 2);
    boundArray[1].setColor([1,1,1,1]);
    
    //Top left to bottom left (left bound)
    boundArray[2] = new LineRenderable(xPos - width / 2, yPos + height / 2, xPos - width / 2, yPos - height /2);
    boundArray[2].setColor([1,1,1,1]);
    
    //Top right to bottom right (right bound)
    boundArray[3] = new LineRenderable(xPos + width / 2, yPos + height / 2, xPos + width / 2, yPos - height /2);
    boundArray[3].setColor([1,1,1,1]);
    
    return boundArray;
};

Patrol.prototype._updatePatrolBound = function()
{
    this.patrolBound = [];
    
    var width = this.boundingBox[3] - this.boundingBox[2];
    var height = this.boundingBox[0] - this.boundingBox[1];
    
    var xPos = this.boundingBox[2] + width / 2;
    var yPos = this.boundingBox[1] + height / 2;
       
    //Top left to top right (top bound)
    this.patrolBound[0] = new LineRenderable(xPos - width / 2, yPos + height / 2, xPos + width / 2, yPos + height / 2);
    this.patrolBound[0].setColor([1,1,1,1]);
    
    //Bottom left to bottom right (bottom bound)
    this.patrolBound[1] = new LineRenderable(xPos - width / 2, yPos - height / 2, xPos + width / 2, yPos - height / 2);
    this.patrolBound[1].setColor([1,1,1,1]);
    
    //Top left to bottom left (left bound)
    this.patrolBound[2] = new LineRenderable(xPos - width / 2, yPos + height / 2, xPos - width / 2, yPos - height /2);
    this.patrolBound[2].setColor([1,1,1,1]);
    
    //Top right to bottom right (right bound)
    this.patrolBound[3] = new LineRenderable(xPos + width / 2, yPos + height / 2, xPos + width / 2, yPos - height /2);
    this.patrolBound[3].setColor([1,1,1,1]);
};

Patrol.prototype.setShowBound = function (showBound)
{
    this.showBound = showBound;
};



// Camden: getters for collisions
Patrol.prototype.getBoundingBox = function() {return this.boundingBox;};
Patrol.prototype.getHead = function () {return this.head;};
Patrol.prototype.getTop = function () {return this.top;};
Patrol.prototype.getBot = function () {return this.bottom;};

Patrol.prototype.draw = function ( camera )
{
    this.head.draw(camera);
    
    this.top.draw( camera );
    
    this.bottom.draw( camera );
    
    if(this.showBound)
    {
        for(var i = 0; i < 4; i++)
        {
            this.topBound[i].draw( camera );
            this.bottomBound[i].draw( camera );
            this.headBound[i].draw( camera );
            this.patrolBound[i].draw( camera );
        }
    }
    
    
};


Patrol.prototype.update = function ()
{
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J))
    {
        this.headCollision();
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.W))
    {
        this.topCollision();
        this.bottomCollision();
    }
    
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
    
    this.topBound = this._updateBound(this.top);
    this.bottomBound = this._updateBound(this.bottom);
    this.headBound = this._updateBound(this.head);
    this._updatePatrolBound();
    
    //Top Bound
    this.boundingBox[0] = this.interpolateTopY.getValue() + 8/2;
    
    //Bottom Bound
    this.boundingBox[1] = this.interpolateBottomY.getValue() - 8/2;
    
    
    this.boundingBox[0] += (this.boundingBox[0] - this.boundingBox[1]) / 2;
    
    //Left Bound
    this.boundingBox[2] = this.positionX - 7.5 / 2;
    
    //Right Bound
    this.boundingBox[3] = this.interpolateTopX.getValue() + 10/2;
    
    
    
    
    
    
    this.checkBounds();
};

// Camden: activates a head collision
Patrol.prototype.headCollision = function()
{
    this.positionX += 5;
};

// Camden: activates a top collision
Patrol.prototype.topCollision = function()
{
    var color = this.top.getColor();
    color[3] += 0.2;
    this.top.setColor(color);
};

// Camden: activates a bot collision
Patrol.prototype.bottomCollision = function()
{
    var color = this.bottom.getColor();
    color[3] += 0.2;
    this.bottom.setColor(color);
};

Patrol.prototype.isDead = function()
{
    //console.log("is it dead yet?");
    var topColor = this.top.getColor();
    var botColor = this.bottom.getColor();
    
    if (topColor[3] >= 1.0) return true;
    if (botColor[3] >= 1.0) return true;
    
    if (this.boundingBox[2] > this.worldWidth / 2) return true;
    
    return false;
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
};

