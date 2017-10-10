function PowerUp(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
PowerUp.prototype.activate = null;
PowerUp.prototype.getPowerUp = function(colour){
  if(colour === "Green"){
    var rand = randomNumberBetween(1, 6);
    if(rand === 1){
      this.activate = addNewBall;
      this.existence = "worth"
    }
    else{
      this.activate = null;
      this.existence = null;
    }
  }
  if(colour === "Red"){
    var randred = randomNumberBetween(1, 7);
    if(randred === 2){
      this.activate = expandPaddle;
      this.existence = "worth";
    }
    else{
      this.activate = null;
      this.existence = null;
    }


  }

  if(colour === "Pink"){
    var randpink = randomNumberBetween(1, 7);
    if(randpink === 3){
      this.activate = shrinkPaddle;
      this.existence = "worth";
    }
    else{
      this.activate = null;
      this.existence = null;
    }
  }

  if(colour === "Yellow"){
    var randyellow = randomNumberBetween(1, 1);
    if(randyellow === 1){
      this.activate = addPaddles;
      this.existence = "worth";
    }
    else{
      this.activate = null;
      this.existence = null;
    }
  }

}

PowerUp.prototype.update = function(du){
  var prevX = this.cx;
  var prevY = this.cy;

  // Compute my provisional new position (barring collisions)
  var nextX = prevX + this.xVel * du;
  var nextY = prevY + this.yVel * du;
  g_paddles.forEach((paddle) => {
    if (paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {
      if(this.activate){
        this.activate();
      }
      this.existence = null;
    }
  })

  if(nextY > g_canvas.height){
    g_powerUps.splice(this.index, 1);
    g_powerUps.forEach((power) => {
      if(power.index > this.index){
        power.index = power.index - 1;
      }
    })
  }

  this.cx += this.xVel*du;
  this.cy += this.yVel*du;
}

PowerUp.prototype.render = function(ctx){
  if(this.existence){
    var  oldStyle = ctx.fillStyle;
    ctx.fillStyle = this.colour;
    fillCircle(ctx, this.cx, this.cy, this.radius);
    ctx.fillStyle = oldStyle;
  }
}

 var expandPaddle = function(){
  g_paddle.halfWidth *= 1.25;
}

var shrinkPaddle = function(){
  g_paddle.halfWidth /= 1.25;
}

var addNewBall = function(){
  var length = g_balls.length;
  var ball = new Ball({
      cx: 200,
      cy: 220,
      radius: 7,

      xVel: 2,
      yVel: 2,
      colour: "Black",
      index : length
  });

  g_balls[length] = ball;
}

function addPaddles(){
  var pad = g_paddles[0];
  g_paddles[0].halfWidth = 23;
  var pad1 = new Paddle({
      cx : pad.cx - 80,
      cy : 350,

      GO_UP   : KEY_W,
      GO_DOWN : KEY_S
  });
  pad1.halfWidth = 23;
  var pad2 = new Paddle({
      cx : pad.cx + 80,
      cy : 350,

      GO_UP   : KEY_W,
      GO_DOWN : KEY_S
  });
  pad2.halfWidth = 23;
  if(g_paddles.length <= 3){
    g_paddles.push(pad1);
    g_paddles.push(pad2);
    console.log(g_paddles);
    setTimeout(() => {
      g_paddles[0].halfWidth = 50;
      g_paddles.splice(1, 2);
    }, 15000);
  }
}

function randomNumberBetween(x, y){
  var rand = Math.floor(Math.random()*y) + x;
  return rand;
}
