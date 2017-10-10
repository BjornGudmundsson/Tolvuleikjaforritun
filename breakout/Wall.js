function Wall(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Wall.prototype.wall = [];

Wall.prototype.populateWall = function(){
  var wBricks = Math.floor(this.width/8);
  var hBricks = Math.floor(this.height/5);
  for(var i = 4; i > -1;i = i - 1){
    this.wall[i] = [];
    var cY = hBricks*i + hBricks/2
    for(var j = 0; j < 8;j++){
      var cX = j*wBricks + wBricks/2;
      var block = {
        cx : cX,
        cy : cY,
        hitPoints : 1,
        colour : this.colours[i],
        width : wBricks,
        height : hBricks,
        power : createPowerUp(this.colours[i], cX, cY)
      }
      this.wall[i].push(new Brick(block));
    }
  }
}

Wall.prototype.render = function(ctx){
  this.wall.forEach((row) =>{
    row.forEach((brick) =>{
      brick.render(ctx);
    })
  })
}

Wall.prototype.collidesWith = function(prevX, prevY,nextX, nextY,r, index){

    var wBricks = Math.floor(this.width/8);
    var hBricks = Math.floor(this.height/5);
    var nextBrick = this.getBrickAtPos(nextX, nextY);
    if(!this.wall[nextBrick[1]]) return "failed";
    var brick = this.wall[nextBrick[1]][nextBrick[0]];
    if(brick && brick.hitPoints !== 0){
      var brickPos = getBrickPos(wBricks*nextBrick[0],
                                hBricks*nextBrick[1], wBricks, hBricks);
      if(inter(prevX, prevY, nextX, nextY,
        brickPos.xS,brickPos.yS,brickPos.xS,brickPos.yE) ||
        inter(prevX, prevY, nextX, nextY,
        brickPos.xE,brickPos.yS,brickPos.xE,brickPos.yE)) {
        brick.collidesWith(index);
        return 'xVel';
    }
    // Check x hits
      if(inter(prevX, prevY, nextX, nextY,
          brickPos.xS,brickPos.yS,brickPos.xE,brickPos.yS) ||
          inter(prevX, prevY, nextX, nextY,
          brickPos.xS,brickPos.yE,brickPos.xE,brickPos.yE)) {
          brick.collidesWith(index);
          return 'yVel';
    }
    }

    /*var x = Math.floor(nextX / wBricks);
    var y = Math.floor(nextY/hBricks);

    var px = Math.floor(prevX/wBricks);
    var py = Math.floor(prevY/hBricks);

    if(0 <= y && y < this.wall.length && 0 <= x && x < this.wall[0].length){
      if(this.wall[y][x].hitPoints !== 0){
        this.wall[y][x].collidesWith();
        if(px === x){
          return "xVel";
        }
        if(py === y){
          return "yVel";
        }
      }

    }*/
    return "failed";
}

Wall.prototype.getBrickAtPos =  function (x,y) {
  var wBricks = Math.floor(this.width/8);
  var hBricks = Math.floor(this.height/5);
  var xPos = Math.floor(x/wBricks);
  var yPos = Math.floor(y / hBricks);
  return [xPos, yPos];
}

function getBrickPos(x, y, w, h) {
  var locations = {
    xS: x,
    yS: y,
    xE: x + w,
    yE: y + h
  }
  return locations;
}

function RotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
  if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
    return 1;
  else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
    return 0;

  return -1;
}

function containsSegment(x1, y1, x2, y2, sx, sy) {
  if (x1 < x2 && x1 < sx && sx < x2) return true;
  else if (x2 < x1 && x2 < sx && sx < x1) return true;
  else if (y1 < y2 && y1 < sy && sy < y2) return true;
  else if (y2 < y1 && y2 < sy && sy < y1) return true;
  else if (x1 == sx && y1 == sy || x2 == sx && y2 == sy) return true;
  return false;
}

function inter(x1, y1, x2, y2, x3, y3, x4, y4) {
  var f1 = RotationDirection(x1, y1, x2, y2, x4, y4);
  var f2 = RotationDirection(x1, y1, x2, y2, x3, y3);
  var f3 = RotationDirection(x1, y1, x3, y3, x4, y4);
  var f4 = RotationDirection(x2, y2, x3, y3, x4, y4);

  // If the faces rotate opposite directions, they intersect.
  var intersect = f1 != f2 && f3 != f4;

  // If the segments are on the same line, we have to check for overlap.
  if (f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0) {
    intersect = containsSegment(x1, y1, x2, y2, x3, y3) || containsSegment(x1, y1, x2, y2, x4, y4) ||
    containsSegment(x3, y3, x4, y4, x1, y1) || containsSegment(x3, y3, x4, y4, x2, y2);
  }

  return intersect;
}

function createPowerUp(color, cX, cY){
  var pUp = {
    cx: cX,
    cy : cY,
    radius : 7,
    xVel : 0,
    yVel : 4,
    colour : color
  }
  var powerUp = new PowerUp(pUp);
  powerUp.getPowerUp(color);
  return powerUp;
}
