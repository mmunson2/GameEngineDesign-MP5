/******************************************************************************** 
 * ZoomCam
 ********************************************************************************/

function ZoomCam()
{
    this.cam1 = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        15,                   // width of camera
        [0, 600, 200, 200]       // viewport (orgX, orgY, width, height)
    );
    this.cam1.setBackgroundColor([0.8, 0.8, 0.8, 1]); // sets the background to gray
    this.cam1.configInterpolation(0.8, 5);
    
    this.cam2 = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        6,                   // width of camera
        [200, 600, 200, 200]       // viewport (orgX, orgY, width, height)
    );
    this.cam2.setBackgroundColor([0.8, 0.8, 0.8, 1]); // sets the background to gray
    
    this.cam3 = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        6,                   // width of camera
        [400, 600, 200, 200]       // viewport (orgX, orgY, width, height)
    );
    this.cam3.setBackgroundColor([0.8, 0.8, 0.8, 1]); // sets the background to gray
    
    this.cam4 = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        6,                   // width of camera
        [600, 600, 200, 200]       // viewport (orgX, orgY, width, height)
    );
    this.cam4.setBackgroundColor([0.8, 0.8, 0.8, 1]); // sets the background to gray
    
    this.cam1bool = false;
    this.forceHeroCam = false;
    
    this.cam2bool = false;
    this.cam2DyePack = null;
    
    this.cam3bool = false;
    this.cam3DyePack = null;
    
    this.cam4bool = false;
    this.cam4DyePack = null;
    
}

ZoomCam.prototype.getCam1 = function()
{
    if (this.cam1bool) return this.cam1;
    else return null;
};

ZoomCam.prototype.getCam2 = function()
{
    if (this.cam2bool) return this.cam2;
    else return null;
};

ZoomCam.prototype.getCam3 = function()
{
    if (this.cam3bool) return this.cam3;
    else return null;
};

ZoomCam.prototype.getCam4 = function()
{
    if (this.cam4bool) return this.cam4;
    else return null;
};

ZoomCam.prototype.updateHeroPos = function(hero)
{
    var x = hero.getRenderable().getXform().getXPos();
    var y = hero.getRenderable().getXform().getYPos();
    this.cam1.setWCCenter(x, y);
};

ZoomCam.prototype.enableHeroCam = function()
{
    this.cam1bool = true;
};

ZoomCam.prototype.disableHeroCam = function()
{
    if (!this.forceHeroCam) this.cam1bool = false;
};

ZoomCam.prototype.addCamera = function(dyePack)
{
    var x = dyePack.getRenderable().getXform().getXPos();
    var y = dyePack.getRenderable().getXform().getYPos();
    
    if (this.cam2DyePack === null)
    {
        this.cam2.setWCCenter(x, y);
        this.cam2DyePack = dyePack;
        this.cam2bool = true;
        return;
    }
    
    else if (this.cam3DyePack === null)
    {
        this.cam3.setWCCenter(x, y);
        this.cam3DyePack = dyePack;
        this.cam3bool = true;
        return;
    }
    
    else if (this.cam4DyePack === null)
    {
        this.cam4.setWCCenter(x, y);
        this.cam4DyePack = dyePack;
        this.cam4bool = true;
        return;
    }
    
};

ZoomCam.prototype.update = function ()
{
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Zero))
    {
        this.forceHeroCam = !this.forceHeroCam;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One))
    {
        this.cam2bool = !this.cam2bool;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two))
    {
        this.cam3bool = !this.cam3bool;
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three))
    {
        this.cam4bool = !this.cam4bool;
    }
    
    if (this.forceHeroCam) this.cam1bool = true;
    
    this.cam1.update();
    this.cam2.update();
    this.cam3.update();
    this.cam4.update();
    
    if (this.cam2DyePack !== null && this.cam2DyePack.isDead())
    {
        this.cam2DyePack = null;
        this.cam2bool = false;
    }
    if (this.cam3DyePack !== null && this.cam3DyePack.isDead())
    {
        this.cam3DyePack = null;
        this.cam3bool = false;
    }
    if (this.cam4DyePack !== null && this.cam4DyePack.isDead())
    {
        this.cam4DyePack = null;
        this.cam4bool = false;
    }
    
    document.getElementById("force_hero").innerHTML = this.forceHeroCam;
};
