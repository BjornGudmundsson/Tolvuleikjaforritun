// ==========
// BALL STUFF
// ==========

// BALL STUFF

function Ball(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

var g_ball = new Ball({
    cx: 200,
    cy: 300,
    radius: 7,

    xVel: 2,
    yVel: 2,
    colour: "Black",
    index : 0
});

var g_balls = [g_ball];


Ball.prototype.update = function (du) {
    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;

    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;

    if(nextX < 0){
      nextX = 0 + this.radius;
      this.xVel *= -1;
    }

    if(nextX > g_canvas.width){
      nextX = g_canvas.width - this.radius;
      this.xVel *= - 1;
    }
    // Bounce off the paddles
    g_paddles.forEach((paddle) => {
      if (paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
      {
          this.yVel *= -1;
      }
    })

    var collision = g_wall.collidesWith(prevX, prevY, nextX, nextY, this.radius, this.index);
    if(collision !== "failed")
    {
      this[collision] *= -1;
    }


    // Bounce off top and bottom edges
    if (nextY < 0) {               // bottom edge
        this.yVel *= -1;
    }

    if(nextY > g_canvas.height){
      if(g_balls.length <= 1){
        this.reset();
      }
      else{
        g_balls.splice(this.index, 1);
        g_balls.forEach((ball) => {
          if(ball.index > this.index){
            ball.index = ball.index - 1;
          }
        })
      }
    }

    // Reset if we fall off the left or right edges
    // ...by more than some arbitrary `margin`
    //

    // *Actually* update my position
    // ...using whatever velocity I've ended up with
    //
    this.cx += this.xVel * du;
    this.cy += this.yVel * du;
};

Ball.prototype.reset = function () {
    this.cx = 200;
    this.cy = 250;
    this.xVel = 3;
    this.yVel = 3;

};

Ball.prototype.render = function (ctx) {
    var  oldStyle = ctx.fillStyle;
    ctx.fillStyle = this.colour;
    fillCircle(ctx, this.cx, this.cy, this.radius);
    ctx.fillStyle = oldStyle;
};
