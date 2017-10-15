/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_bullets : [],
_ships   : [],

_bShowRocks : false,

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
	NUM_ROCKS = 4;

    // TODO: Make `NUM_ROCKS` Rocks!

    for(var i = 0; i < 4;i++){
      this._rocks[i] = new Rock();
    }
},

_findNearestShip : function(posX, posY) {

    // TODO: Implement this

    // NB: Use this technique to let you return "multiple values"
    //     from a function. It's pretty useful!
    //
    var minDist = Number.POSITIVE_INFINITY,
        closestShip = null,
        closestIndex = -1;
    for (var i = 0; i < this._ships.length; i++) {
      var x = this._ships[i].cx;
      var y = this._ships[i].cy;
      var dist = util.wrappedDistSq(x, y, posX, posY, g_canvas.width, g_canvas.height);
      if(dist < minDist){
        closestShip = this._ships[i];
        closestIndex = i;
        minDist = dist;
      }
    }
    return {
	theShip : closestShip,   // the object itself
	theIndex: closestIndex   // the array index where it lives
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
	fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships];
},

init: function() {
    this._generateRocks();

    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {

    // TODO: Implement this
    var w = g_sprites.ship.width;
    var h = g_sprites.ship.height;
    var newX = cx +Math.sin(rotation)*h/2;
    var newY = cy -Math.cos(rotation)*h/2;
    var bulletObj = {
      velX : velX,
      velY : velY,
      rotation : rotation
    };
    var bullet = new Bullet(bulletObj);
    bullet.setPos(newX, newY);
    this._bullets.push(bullet);
},

generateShip : function(descr) {
    // TODO: Implement this
    var ship = new Ship(descr);
    this._ships.push(ship);
},

killNearestShip : function(xPos, yPos) {
    // TODO: Implement this

    // NB: Don't forget the "edge cases"\
    console.log(xPos);
    var w = g_canvas.width,
        h = g_canvas.height;
      if(util.isBetween(xPos,0, g_canvas.width) && util.isBetween(yPos,0, g_canvas.height)){
        var ship = this._findNearestShip(xPos, yPos);
        console.log(ship);
        this._ships[ship.closestIndex].dead = true;
      }
},

yoinkNearestShip : function(xPos, yPos) {
    // TODO: Implement this

    // NB: Don't forget the "edge cases"
    var w = g_canvas.width,
        h = g_canvas.height;
      if(util.isBetween(xPos,0, g_canvas.width) && util.isBetween(yPos,0, g_canvas.height)){
        var ship = this._findNearestShip(xPos, yPos);
        ship.theShip.cx = xPos;
        ship.theShip.cy = yPos;
        this._ships[ship.closestIndex] = ship.theShip;
      }
},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {

    // TODO: Implement this

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.

    for (var i = 0; i < this._ships.length; i++) {
      if(this._ships[i].dead){
        this._ships.splice(i, 1);
      }
      else{
        this._ships[i].update(du);
      }
    }
    this._rocks.forEach((rock) => {
      rock.update(du);
    });

    this._bullets.forEach((bullet) =>{
      bullet.update(du);
    });
},

render: function(ctx) {

    // TODO: Implement this

    // NB: Remember to implement the ._bShowRocks toggle!
    // (Either here, or if you prefer, in the Rock objects
    this._ships.forEach((ship) => {
      ship.render(ctx);
    });

    this._rocks.forEach((rock) => {
      rock.render(ctx);
    });
    for (var i = 0; i < this._bullets.length; i++) {
      if(this._bullets[i].alive === -1){
        this._bullets.splice(i, 1);
      }
      else{
        this._bullets[i].render(ctx);
      }
    }

}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
