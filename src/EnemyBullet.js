import Collider from "./Collider.js";
export default class EnemyBullet{
    constructor(x, y, vx, vy, img){
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.w = 7; this.h = 7;
        this.despawn = false;
        this.collider = Collider;
        this.type = 'enemyBullet';
        this.img = img
    
    }

    update(dt){
        this.x += this.vx * dt; this.y += this.vy * dt;
        if(this.y > 1000 || this.x > 800 || this.x < -100) this.despawn = true;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.w,this.h);
    }

    
    get left()   { return this.x; }
    get right()  { return this.x + this.w; }
    get top()    { return this.y; }
    get bottom() { return this.y + this.h; }

    onCollision(other, game){
        if(other.type == 'player'){
        }
    }
}

