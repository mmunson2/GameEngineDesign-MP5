/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame()
{
    this.mCamera = null;

    this.spriteSheet = "assets/SpriteSheet.png";
    this.mountainTexture = "assets/mountain.png";
    this.mountainsTexture = "assets/mountains.png";
    this.skyTexture = "assets/sky.png";
    this.trees1Texture = "assets/trees1.png";
    this.trees2Texture = "assets/trees2.png";
       
    this.powerUp = false;
    this.showBound = false;
    
    this.hero = null;
    
    this.dyePacks = [];
    
    this.patrolSet = null;
    
    this.background = null;
    
    this.zoomCam = null;
  
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function ()
{
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        200,                   // width of camera
        [0, 0, 800, 600]       // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]); // sets the background to gray

    gEngine.Textures.loadTexture(this.spriteSheet);
    gEngine.Textures.loadTexture(this.mountainTexture);
    gEngine.Textures.loadTexture(this.mountainsTexture);
    gEngine.Textures.loadTexture(this.skyTexture);
    gEngine.Textures.loadTexture(this.trees1Texture);
    gEngine.Textures.loadTexture(this.trees2Texture);
    
    this.hero = new Hero(this.spriteSheet);
    
    this.patrolSet = new PatrolSet(this.spriteSheet, 200);

    this.background = new Background(this.skyTexture, this.mountainTexture, this.mountainsTexture, this.trees1Texture, this.trees2Texture);
    
    this.zoomCam = new ZoomCam();
};

MyGame.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.spriteSheet);
    gEngine.Textures.unloadTexture(this.mountainTexture);
    gEngine.Textures.unloadTexture(this.mountainsTexture);
    gEngine.Textures.unloadTexture(this.skyTexture);
    gEngine.Textures.unloadTexture(this.trees1Texture);
    gEngine.Textures.unloadTexture(this.trees2Texture);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function ()
{
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    
    this.background.draw(this.mCamera);
    
    
    
    this.hero.draw(this.mCamera);
    
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        this.dyePacks[i].draw(this.mCamera);
    }
        
    this.patrolSet.draw(this.mCamera);
    
    var cam1 = this.zoomCam.getCam1();
    var cam2 = this.zoomCam.getCam2();
    var cam3 = this.zoomCam.getCam3();
    var cam4 = this.zoomCam.getCam4();
    
    if (cam1 !== null)
    {
        cam1.setupViewProjection();
        this.background.draw(cam1);
        this.hero.draw(cam1);
        for (var i = 0; i < this.dyePacks.length; i++)
        {
           this.dyePacks[i].draw(cam1);
        }
        
        this.patrolSet.draw(cam1);
    }
    
    if (cam2 !== null)
    {
        cam2.setupViewProjection();
        this.background.draw(cam2);
        this.hero.draw(cam2);
        for (var i = 0; i < this.dyePacks.length; i++)
        {
           this.dyePacks[i].draw(cam2);
        }
        this.patrolSet.draw(cam2);
    }
    
    if (cam3 !== null)
    {
        cam3.setupViewProjection();
        this.background.draw(cam3);
        this.hero.draw(cam3);
        for (var i = 0; i < this.dyePacks.length; i++)
        {
           this.dyePacks[i].draw(cam3);
        }
        this.patrolSet.draw(cam3);
    }
    
    if (cam4 !== null)
    {
        cam4.setupViewProjection();
        this.background.draw(cam4);
        this.hero.draw(cam4);
        for (var i = 0; i < this.dyePacks.length; i++)
        {
           this.dyePacks[i].draw(cam4);
        }
        this.patrolSet.draw(cam4);
    }
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () 
{
    // Camden: spawning new dyepacks on Space click
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        var hand = this.hero.getHandPos();
        this.dyePacks.push(new DyePack(this.spriteSheet, hand[0], hand[1], 2, 0, 200));
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.A))
    {
        this.powerUp = !this.powerUp;
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B))
    {
        this.showBound = !this.showBound;
        
        this.hero.setShowBound(this.showBound);
        this.patrolSet.setShowBound(this.showBound);
    }

    // Camden: updating all the dye packs
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        this.dyePacks[i].update();
    }
    
    // Camden: checking for dead dyepacks
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        if (this.dyePacks[i].isDead())
        {
            this.dyePacks.splice(i, 1);
            break;
        }
    }
    
    // Camden: checking for dyepack collisions
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        if (this.patrolSet.dyePackCollide(this.dyePacks[i]))
        {
            this.zoomCam.addCamera(this.dyePacks[i]);
        }
    }
    
    // Camden: checking for hero collision
    if (this.patrolSet.heroCollide(this.hero))
    {
        this.hero.startShake();
        this.zoomCam.enableHeroCam();
    }
    
    if (!this.hero.isShaking()) this.zoomCam.disableHeroCam();
    
    if(this.powerUp)
    {
        var hand = this.hero.getHandPos();
        this.dyePacks.push(new DyePack(this.spriteSheet, hand[0], hand[1], Math.random() * 4 - 2, Math.random() * 4 - 2, 200));
    }
    
    this.hero.update();
    this.zoomCam.updateHeroPos(this.hero);
    
    this.patrolSet.update();
    
    this.background.update();
    
    this.zoomCam.update();
    
    document.getElementById("num_dyepacks").innerHTML = this.dyePacks.length;
};