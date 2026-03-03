import Collider from "./Collider.js";
export default class powerUp{
    constructor(x, y, sprite, w, h, t){
        this.x = x; this.y = y;
        this.t = t;
        this.baseY = y; this.time = 0;
        this.w = w; this.h = h;
        this.type = 'powerUp';
        this.despawn = false;
        this.collider = Collider;
        this.sprite = sprite;
        this.bulletPowerUpSound = new Audio("/Warhawk/assets/reload.mp3");
        this.bulletPowerUpSound.volume = 0.3;
        this.healthSound = new Audio("/Warhawk/assets/health.mp3")
        this.healthSound.volume = 1;
    }
    
    update(dt){
        this.time += dt;
        this.y = this.baseY + Math.sin(this.time * 4) * 7;
    }
    get left()   { return this.x; }
    get right()  { return this.x + this.w; }
    get top()    { return this.y; }
    get bottom() { return this.y + this.h; }

    apply(player){

    }

    draw(ctx){
        ctx.drawImage(
            this.sprite,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }

    onCollision(other, game){
        if(other.type == 'player'){
            this.apply(game.player);
            if(this.t == "bulletPowerUp"){
                this.bulletPowerUpSound.play();
           }else if(this.t == "health"){
                this.healthSound.currentTime = 0.04
                this.healthSound.play();
            }
            this.despawn = true;

           
        }
    }
};