import SmokeParticle from "./smoke.js";
import Collider from "./Collider.js";
import { Explosion } from "./Explosion.js";

export class missileShoot{
    constructor(x,y){
        this.type = 'playerMissile';
        this.x = x; this.y = y;
        this.w = 12; this.h = 48;
        this.speed = 300;
        this.despawn = false;
        
        this.smokeTimer = 0;
        this.img = new Image();
        this.img.src = "/Warhawk/assets/missile.png";
        this.collider =  Collider;
    }

    update(dt, game){
        this.y -= dt * this.speed;

        this.smokeTimer = (this.smokeTimer || 0) + dt;

        if (this.smokeTimer > 0.03) {
        this.smokeTimer = 0;


        game.entities.add(new SmokeParticle(this.x + this.w/2, this.y + this.h));  
        }

           if(this.y < 0){
            this.despawn = true;
        }
    }

    draw(ctx){
        ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.w,
            this.h
            
        )
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
        if(other.type == 'enemy'){
            this.despawn = true;
        }
    }
};