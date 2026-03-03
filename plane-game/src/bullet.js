import Collider from "./Collider.js";
export default class Bullet{
    constructor(x, y, vx= 1, vy= 0){
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.w = 6; this.h = 10;
        this.despawn = false;
        this.type = 'playerBullet';
        
        this.collider = Collider;

        this.bulletSprite = new Image();
        this.bulletSprite.src = "/Warhawk/assets/Bullets.png";

        this.currSprite = this.bulletSprite;
    }

    update(dt){
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if(this.x < -20 || this.y < -20 || this.x > 600) this.despawn = true;
    }

    draw(ctx){
        ctx.drawImage(
            this.currSprite,
            this.x,
            this.y,
            this.w,
            this.h
        )
    }

    get left(){return this.x}
    get right(){return this.x+this.w}
    get top(){return this.y}
    get bottom(){return this.y+this.h}

    onCollision(other, game){
        if(other.type == 'enemy'){
            this.despawn = true;
        }
    }



}