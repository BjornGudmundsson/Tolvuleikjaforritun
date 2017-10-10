// "Crappy PONG" -- step by step
//
// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// ============
// PADDLE STUFF
// ============

// PADDLE 1

var KEY_W = 'W'.charCodeAt(0);
var KEY_S = 'S'.charCodeAt(0);

var g_paddle = new Paddle({
    cx : 200,
    cy : 350,

    GO_UP   : KEY_W,
    GO_DOWN : KEY_S
});

var g_paddles = [g_paddle];

/*var g_brick = new Brick({
  cx : 250,
  cy : 100,
  hitPoints : 3,
  colour : "Blue",
  width : 80,
  height : 40
})*/

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
   for(var i = 0; i < g_balls.length; i++) {
     g_balls[i].update(du);
   }

   for (var i = 0; i < g_powerUps.length; i++) {
     g_powerUps[i].update(du)
   }

   g_paddles.forEach((paddle) => {
     paddle.update(du);
   })


}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

  g_balls.forEach((ball) => {
    ball.render(ctx);
  });

  g_powerUps.forEach((powerUp) => {
    powerUp.render(ctx);
  });

  g_paddles.forEach((paddle) => {
    paddle.render(ctx);
  })

    //g_brick.render(ctx);
    g_wall.render(ctx);
}

// Kick it off
g_main.init();
