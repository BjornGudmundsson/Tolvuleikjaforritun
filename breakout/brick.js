function Brick(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Brick.prototype.render = function(ctx){
  if(this.hitPoints > 0){
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.cx - this.width/2, this.cy - this.height/2, this.width, this.height);
    ctx.fillStyle = "Black";
    ctx.rect(this.cx - this.width/2, this.cy - this.height/2, this.width, this.height);
    ctx.stroke();
    ctx.fillStyle = oldStyle;
  }
}


Brick.prototype.collidesWith = function(index){

  this.hitPoints -= 1;
  var ball = g_balls[index];
  if(this.hitPoints === 0){
      ball.colour = this.colour;
      this.playAudio();
      length = g_powerUps.length;
      if(this.power.existence){
        g_powerUps[length] = this.power;
        this.power.index = length;
      }
  }
}

Brick.prototype.playAudio = function(){
  g_songs[0].pause();
  g_wazzupBitches.play();
  setTimeout(() => {
    g_wazzupBitches.pause();
    g_wazzupBitches.currentTime = 4;
    g_songs[0].play();
  }, 5000);
}
