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
    
    this.mountains = null;
    this.mountains = null;
    this.sky = null;
    this.trees1 = null;
    this.trees2 = null;
   
   
    this.testDyePack = null;
    
    this.hero = null;
    
    this.dyePacks = [];
    
    this.patrolSet = null;
  
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

    this.testDyePack = new DyePack(this.spriteSheet, 0, 0, 2, 0, 200);
    
    this.hero = new Hero(this.spriteSheet);
    
    this.patrolSet = new PatrolSet(this.spriteSheet, 200);
    
    
    this.sky = new TextureRenderable(this.skyTexture);
    this.sky.getXform().setPosition(0, 0);
    this.sky.getXform().setHeight(200 / 1.333333);
    this.sky.getXform().setWidth(200);
    
    this.mountain = new TextureRenderable(this.mountainTexture);
    this.mountain.getXform().setPosition(0,-10);
    this.mountain.getXform().setHeight(200 / 1.33333);
    this.mountain.getXform().setWidth(200);
    
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
    
    
    this.sky.draw( this.mCamera );
    this.mountain.draw( this.mCamera );
    
    
    
    this.hero.draw(this.mCamera);
    
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        this.dyePacks[i].draw(this.mCamera);
    }
    
    this.testDyePack.draw(this.mCamera);
    
    this.patrolSet.draw(this.mCamera);
    
    
};

MyGame.prototype._wrapTexture = function (camera, renderable)
{
    var width = renderable.getXform().getWidth();
    var height = renderable.getXform().getHeight();
    
    var startX = renderable.getXform().getPosition()[0];
    var startY = renderable.getXform().getPosition()[1];
    
    var worldLeftBound = -200 / 2;
    var worldRightBound = 200 / 2;
    
    
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
        this.patrolSet.dyePackCollide(this.dyePacks[i]);
    }
    
    // Camden: checking for hero collision
    this.patrolSet.heroCollide(this.hero);
    
    if(this.testDyePack.isDead())
    {
        var hand = this.hero.getHandPos();
        this.testDyePack = new DyePack(this.spriteSheet, hand[0], hand[1], Math.random() * 4 - 2, Math.random() * 4 - 2, 200);
    }
    
    this.testDyePack.update();
    this.hero.update();
    this.patrolSet.update();
};