import Collider from "./Collider.js";
export default class powerUp{
    constructor(x, y, sprite, w, h){
        this.x = x; this.y = y;
        this.baseY = y; this.time = 0;
        this.w = w; this.h = h;
        this.type = 'powerUp';
        this.despawn = false;
        this.collider = Collider;
        this.sprite = sprite;
    }
    
    update(dt){
        this.time += dt;
        this.y = this.baseY + Math.sin(this.time * 4) * 5;
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
            this.despawn = true;
        }
    }
};