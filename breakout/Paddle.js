// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.wrappedPaddles = [];
    this.wrappedPaddles[0] = {
      cx : this.cx + g_canvas.width,
      cy : this.cy
    };
    this.wrappedPaddles[1] = {
      cx : this.cx - g_canvas.width,
      cy : this.cy
    }
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.
var KEY_Z = "Z".charCodeAt(0);
Paddle.prototype.halfWidth = 50;
Paddle.prototype.halfHeight = 10;
Paddle.prototype.toggle = true;

Paddle.prototype.update = function (du) {
    if (g_keys[this.GO_UP]) {
        this.cx -= 5 * du;
        this.wrappedPaddles[0].cx =this.cx + g_canvas.width - 5;
        this.wrappedPaddles[1].cx = this.cx - g_canvas.width - 5;
    } else if (g_keys[this.GO_DOWN]) {
        this.cx += 5 * du;
        this.wrappedPaddles[0].cx =  this.cx + g_canvas.width + 5;
        this.wrappedPaddles[1].cx = this.cx - g_canvas.width + 5;
    }
    if(this.cx < 0){
      this.cx = g_canvas.width;
      this.wrappedPaddles[1].cx = this.cx - g_canvas.width;
      this.wrappedPaddles[0].cx = this.cx + g_canvas.width
    }
    if(this.cx > g_canvas.width){
      this.cx = 0;
      this.wrappedPaddles[1].cx = this.cx - g_canvas.width;
      this.wrappedPaddles[0].cx = this.cx + g_canvas.width
    }
};



Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    var wrap = this.wrappedPaddles;
    if(!this.toggle){
      if(this.cx < 0 + this.halfWidth){
        this.cx = 0 + this.halfWidth
      }
      if(this.cx + this.halfWidth > g_canvas.width){
        this.cx = g_canvas.width - this.halfWidth
      }

    }
    if(this.toggle){
      this.draw(ctx, wrap[0].cx, wrap[0].cy);
      this.draw(ctx, wrap[1].cx, wrap[1].cy);
    }

    this.draw(ctx, this.cx, this.cy)
};

Paddle.prototype.draw = function(ctx, cx, cy){
  ctx.fillRect(cx - this.halfWidth,
               cy - this.halfHeight,
               this.halfWidth * 2,
               this.halfHeight * 2);
}

Paddle.prototype.collidesWith = function (prevX, prevY,nextX, nextY,r) {
  var OGcx = this.cx;
  var OGcy = this.cy;
  var wrap = this.wrappedPaddles;
  var OGcollide = this.collide(OGcx, OGcy, prevX, prevY,nextX, nextY,r);
  var collide1 = this.collide(wrap[0].cx, wrap[0].cy, prevX, prevY,nextX, nextY,r);
  var collide2 = this.collide(wrap[1].cx, wrap[1].cy, prevX, prevY,nextX, nextY,r);
  return OGcollide || collide1 || collide2;
};

Paddle.prototype.collide = function(cx, cy, prevX, prevY, nextX, nextY, r){
  var paddleEdgeUp = cy - r;
  // Check X coords
  if ((nextY - r < paddleEdgeUp && prevY - r >= paddleEdgeUp) ||
      (nextY + r > paddleEdgeUp && prevY + r <= paddleEdgeUp)) {
      // Check Y coords
      if (nextX + r >= cx - this.halfWidth &&
          nextX - r <= cx + this.halfWidth) {
          // It's a hit!
          return true;
      }
  }

  var paddleEdgeDown = cy + r;
  if ((nextY - r < paddleEdgeDown && prevY - r >= paddleEdgeDown) ||
      (nextY + r > paddleEdgeDown && prevY + r <= paddleEdgeDown)) {
      // Check Y coords
      if (nextX + r >= cx - this.halfWidth &&
          nextX - r <= cx + this.halfWidth) {
          // It's a hit!
          return true;
      }
  }
  // It's a miss!
  return false;
}
