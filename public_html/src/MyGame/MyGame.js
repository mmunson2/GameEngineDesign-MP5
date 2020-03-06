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

function MyGame() {
    // The camera to view the scene
    this.mCamera = null;

    this.spriteSheet = "assets/SpriteSheet.png";
    
    this.testDyePack = null;
    
    this.hero = null;
    
    this.dyePacks = [];
    
    this.testPatrol = null;
  
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0), // position of the camera
        200,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray


    gEngine.Textures.loadTexture(this.spriteSheet);

    this.testDyePack = new DyePack(this.spriteSheet, 0, 0, 2, 0, 200);
    
    //this.testDyePack.initialize();
    
    this.hero = new Hero(this.spriteSheet);
    
    this.testPatrol = new Patrol(this.spriteSheet, 0, 0, 1/6, 1/6, 200);
       
};

MyGame.prototype.unloadScene = function ()
{
    gEngine.Textures.unloadTexture(this.spriteSheet);
    
    
};




// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    this.mCamera.setupViewProjection();
    
    this.hero.draw(this.mCamera);
    
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        this.dyePacks[i].draw(this.mCamera);
    }
    
    this.testDyePack.draw(this.mCamera);
    
    this.testPatrol.draw(this.mCamera);
    
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () 
{
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        var hand = this.hero.getHandPos();
        this.dyePacks.push(new DyePack(this.spriteSheet, hand[0], hand[1], 2, 0, 200));
    }
    
    this.hero.update();
    
    for (var i = 0; i < this.dyePacks.length; i++)
    {
        this.dyePacks[i].update();
        if (this.dyePacks[i].isDead())
        {
            this.dyePacks.splice(i, 1);
        }
    }
    
    if(this.testDyePack.isDead())
    {
        var hand = this.hero.getHandPos();
        this.testDyePack = new DyePack(this.spriteSheet, hand[0], hand[1], Math.random() * 4 - 2, Math.random() * 4 - 2, 200);
    }
    
    this.testDyePack.update();
    
    this.testPatrol.update();
};