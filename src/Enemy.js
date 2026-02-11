// src/Enemy.js
import Collider from "./Collider.js";
import { straightPower } from "./straightPower.js";
import { health } from "./health.js";
import { missilePower } from "./missilePower.js";
import EnemyBullet from "./EnemyBullet.js";
import {missile, spawnBullet} from "./shootingPatterns.js";
import { Explosion } from "./Explosion.js";

export default class Enemy {
  constructor(opts = {}) {
    this.x = opts.x ?? 0;
    this.y = opts.y ?? -30;
    this.w = opts.w ?? 70;
    this.h = opts.h ?? 85;
    this.hp = opts.hp ?? 105;
    this.colour = opts.colour ?? "blue";
    this.speed = opts.speed ?? 95; this.vx = 0; this.vy = this.speed, 
    this.despawn = false; this.onDeath = null; this.dropPowerUp = "nothing"; 
    this.type = 'enemy'; this.class = opts.class ?? "normal";
    this.timeAlive = 0; this.isDead = false;
    this.game = opts.game ?? null;
    this.pattern = opts.pattern ?? null;
    this.fireTimer = opts.fireTimer ?? 3; this.tempTimer = this.fireTimer; 
    this.hasShot = false;
    this.collider = Collider;
    this.shotsPattern = opts.shotsPattern ?? 1; 
    this.shotType = opts.shotType ?? "multiple";
    this.colourTimer = 0; this.hitTimer = 0; this.hitDuration = 0.1;
    this.original = this.colour;
    this.spritesheet = opts.spritesheet ?? null;

    this.frames = opts.frames ?? [];
    this.frameCount = opts.frameCount ?? 1;   
    this.frame = 0;
    this.frameTimer = 0;
    this.frameRate = opts.frameRate ?? 0.1;
    this.roate = opts.rotate ?? 0; 

    this.burstQueue = []; this.burstRounds = opts.burstRounds ?? 2;    
    this.burstInterval = 0.1; this.burstSpread = opts.Spread ?? 0;
    this.burstTimer = 0; 

    this.missileLife = 0;

    this.preX = this.x;
    this.preY = this.y;
    this.spriteDir = "center"; this.phase = opts.phase ?? "enter";
    this.miniBoss2Shift = 0;

    this.rotationMode = opts.rotationMode ?? "curved";  
    this.lockedTimer = 0.4;
    this.shootingPattern = opts.shootingPattern ?? null;
    this.canShoot = opts.canShoot ?? 1.0;

    this.directionAngle = opts.directionAngle ?? Math.PI;
    this.bankAngle = 0;
    this.angle = opts.angle ?? 0;
    // pattern tunables/
    this.curveDelay = opts.curveTimer ?? 100;
    this.curveTimer = 0;
    this.curveSpeed = 1.2;
    this._sineFreq = opts.sineFreq ?? 3.0;
    this._sineAmp = opts.sineAmp ?? 60;
    this._zigFreq = opts.zigFreq ?? 1.5;
    this._zigAmp = opts.zigAmp ?? 100;
    this._diveTime = opts.diveTime ?? 1.2;
    this._diveSpeed = opts.diveSpeed ?? 260;
    this._targetX =
      opts.targetX ??
      (this.game && this.game.player
        ? this.game.player.x + this.game.player.width / 2
        : 240);
    this._targetY =
      opts.targetY ??
      (this.game && this.game.player
        ? this.game.player.y + this.game.player.height / 2
        : 700);
    this._hoverBaseY = opts.hoverBaseY ?? this.y;
    this._hoverFreq = opts.hoverFreq ?? 0.9;
    this._hoverAmp = opts.hoverAmp ?? 40;
    this._arcCenterX = opts.arcCenterX ?? this.x;
    this._arcCenterY = opts.arcCenterY ?? this.y;
    this._arcRadius = opts.arcRadius ?? 120;
    this._arcSpeed = opts.arcSpeed ?? 1.2;
    this.timeParam = 0;
    this._followSpeed = opts.followSpeed ?? 120;
    this._followDist = opts.followDist ?? 200;

  }

  update(dt, game) {
    this.timeAlive += dt;

   if(this.hitTimer > 0){
    this.hitTimer -= dt;
   }
    
   if(Array.isArray(this.frames)){

     this.frameTimer += dt;
     while(this.frameTimer >= this.frameRate){
      this.frame = (this.frame + 1) % this.frameCount;
      this.frameTimer -= this.frameRate;
    }
   }

   if (this.rotationMode === "curved") {
    const dx = this.x - this.preX;
    const BANK_ANGLE = Math.PI/16;
    const SMOOTH = 0.02;
    
    const flip = (this.directionAngle === Math.PI) ? -1 : 1;

    let Ang = 0;
    if (dx > 0.4) Ang = -BANK_ANGLE;
    else if (dx < -0.4) Ang  = BANK_ANGLE;
    

    this.bankAngle += (flip * Ang - this.bankAngle)*SMOOTH; 

    this.preX = this.x;
    
}else if(this.rotationMode == "diagonal"){
    const movementAngle = Math.atan2(this.diag.vy, this.diag.vx) - Math.PI / 2;

    let diff = movementAngle - this.directionAngle;

    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const MAX_BANK = Math.PI / 10;
    const FLATNESS = 0.4;

    diff = Math.max(-MAX_BANK, Math.min(MAX_BANK, diff));

    this.bankAngle += (diff - this.bankAngle) * FLATNESS;
}else if(this.rotationMode == "side"){
  const dy = this.y - this.preY;
  const BANK_ANGLE = Math.PI/16;
  const SMOOTH = 0.02;
  
  const flip = (this.directionAngle === Math.PI/2) ? -1 : 1;

  let Ang = 0;
  if (dy > 10.4) Ang = -BANK_ANGLE;
  
    

  this.bankAngle += (flip * Ang - this.bankAngle)*SMOOTH; 

  this.prey = this.y;
}
  
   this.angle = this.directionAngle  + this.bankAngle;

        
    if (typeof this.pattern === "function") {
      try {
        this.pattern(this, dt, game);
      } catch (e) {
      }
    } else {
      this.y += this.speed * dt;
    }
   

    if(this.colourTimer > 0){
      this.colourTimer -= dt;

      if(this.colourTimer <= 0){
        this.colour = this.original;
      }

    }
  
    if(this.rotationMode == "diagonal" || this.rotationMode == "side"){
      if(!this.hasShot && this.timeAlive >= 1.2){
        if(this.shootingPattern){
          this.shootingPattern(game, this);
          this.hasShot = true;
        }
      }
      
    }else{

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      this.fireTimer = this.tempTimer;
      if(this.shootingPattern){
        this.shootingPattern(game, this);
      }

    }
       for(let i = this.burstQueue.length - 1; i >= 0; i--){
        this.burstQueue[i].delay -= dt;
          if(this.burstQueue[i].delay <= 0){
            spawnBullet(game, this, this.burstQueue[i].dx, this.burstQueue[i].dy);
            this.burstQueue.splice(i, 1);
        }
    }



    }
    if(this.rotationMode != "miniBoss2" && this.class != "miniBoss"){
      if (this.y > (game.h + this.h) || this.y < -60 || this.x > game.w + 60 || this.x < -60) this.death(game);
    }
    
  }

 draw(ctx) {
       ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.ellipse(
        this.x + this.w / 2 + 6,   // center X
        this.y + this.h + 10,     // center Y
        this.w * 0.4,              // radius X
        this.h * 0.25,            // radius Y
        0, 0, Math.PI * 2
        );
        ctx.fill();

  ctx.restore();



  if (this.frames.length === 0) return;
    let img;
    if(Array.isArray(this.frames)){
      img = this.frames[this.frame];
    }else{
      const dirFrames = this.frames[this.spriteDir] || this.frames.center;
      img = this.frames.center;
    }

    if(!img) return;
        ctx.save();

    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);

    
    ctx.rotate(this.angle || 0);

    if(this.hitTimer > 0 ){
      ctx.filter = "brightness(2)";
    }

    ctx.drawImage(img, -this.w / 2, -this.h / 2, this.w, this.h);

    ctx.filter = "none";

    ctx.restore();
}

  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.w;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.h;
  }

  onCollision(other, game){
    if(other.type == 'player' || other.type == 'playerBullet'){
      this.hp -= 8;    
      this.hitTimer = this.hitDuration;
        if(this.hp <= 0){
        game.score += 1;
        this.death(game);
        }     

    }else if(other.type == 'playerMissile'){
      this.hp -= 70;
      game.entities.add(new Explosion(this.x + this.w/2 - 200, this.y + this.h/2 - 200, game.explosionImg, 400, 400, 'missile'));
      this.hitTimer = this.hitDuration;
        if(this.hp <= 0){
        game.score += 1;
        this.death(game);
        }     

    }

    if(other.type == 'explosion'){
      if(other.t == 'missile'){
        this.hp -= 200;
        this.hitTimer = this.hitDuration;
        if(this.hp <= 0){
        game.score += 1;
        this.death(game);
      }     
      }
    }
    
  }

  
  death(game){
    if(this.isDead){
      return;
    }

    this.isDead = true;
    this.despawn = true;
    if(this.onDeath) {
      //console.log("Calling onDeath callback");
      this.onDeath();
    }
    game.entities.add(new Explosion(this.x, this.y, game.explosionImg, this.w, this.h, 'self'));

      

      if(this.dropPowerUp == 'straightShot'){
           game.entities.add( new straightPower(this.x + this.w/2, this.y + this.h/2));
           console.log("Spawning powerup");
      }else if(this.dropPowerUp == 'health'){
           game.entities.add( new health(this.x + this.w/2, this.y + this.h/2));
           console.log("Spawning powerup");
      }else if(this.dropPowerUp == 'missile'){
          game.entities.add(  new missilePower(this.x + this.w/2, this.y + this.h/2));
      }
   


  }
}
