import Collider from "./Collider.js";
import SmokeParticle from "./smoke.js";
import { Explosion } from "./Explosion.js";

export default class EnemyBullet{
    constructor(x, y, vx, vy, img, opts={}){
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.w = opts.w || 7; this.h = opts.h ||  7;
        this.despawn = false;
        this.collider = Collider;
        this.type = 'enemyBullet';
        this.img = img
        this.hp = 20;
        
        this.smokeTimer = 0;
        this.speed = opts.speed || 110;
        this.homing = opts.homing || false;
        this.turnRate = opts.turnRate || 2;
        this.class = opts.class || "normal";
        this.angle = Math.atan2(vy, vx); // Track rotation angle
    }

    update(dt, game){
        if(this.homing && game.player){

    const px = game.player.x + game.player.width/2;
    const py = game.player.y + game.player.height/2;

    const dx = px - this.x;
    const dy = py - this.y;

    const targetAngle = Math.atan2(dy, dx);
    const currentAngle = Math.atan2(this.vy, this.vx);

    let diff = targetAngle - currentAngle;

    diff = Math.atan2(Math.sin(diff), Math.cos(diff));

    const maxTurn = this.turnRate * dt;

    if(Math.abs(diff) < maxTurn){
      this.vx = Math.cos(targetAngle) * this.speed;
      this.vy = Math.sin(targetAngle) * this.speed;
      this.angle = targetAngle; // Update rotation
    } else {
      const newAngle = currentAngle + Math.sign(diff) * maxTurn;
      this.vx = Math.cos(newAngle) * this.speed;
      this.vy = Math.sin(newAngle) * this.speed;
      this.angle = newAngle; // Update rotation
    }

    this.smokeTimer = (this.smokeTimer || 0) + dt;
    
        if (this.smokeTimer > 0.03) {
        this.smokeTimer = 0;
    
        
        game.entities.add(new SmokeParticle(this.x + this.w, ));  
    }
  } else {
    this.angle = Math.atan2(this.vy, this.vx);
  }

        this.x += this.vx * dt; this.y += this.vy * dt;
        if(this.y > 1000 || this.x > 800 || this.x < -100) this.despawn = true;
    }

    draw(ctx){
        if(this.homing){
            ctx.save();
            ctx.translate(this.x + this.w/2, this.y + this.h/2);
            ctx.rotate(this.angle);
            ctx.drawImage(this.img, -this.w/2, -this.h/2, this.w, this.h);
            ctx.restore();
        } else {
            // Normal bullets drawn without rotation
            ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        }
    }

    
    get left()   { return this.x; }
    get right()  { return this.x + this.w; }
    get top()    { return this.y; }
    get bottom() { return this.y + this.h; }

    onCollision(other, game){
        if(other.type == 'playerBullet'){
            if(this.class == 'missile'){
                this.hp -= 4;
                if(this.hp <= 0){
                    this.despawn = true;
                    game.entities.add(new Explosion(this.x, this.y, game.explosionImg, 30, 30, 'self'));
                }
            }
        }

        if(other.type == 'player'){
            if(this.class == 'missile'){
            game.entities.add(new Explosion(this.x, this.y, game.explosionImg, 30, 30, 'self'));
            }
        }
    }
}