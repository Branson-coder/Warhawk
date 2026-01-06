import Collider from "./Collider.js";
export default class powerUp{
    constructor(x, y){
        this.x  = x; this.y = y;
        this.type = 'powerUp';
        this.despawn = false;
        this.collider = Collider;
        this.sprite = new Image();
        this.sprite.src = "./src/engine/assets/powerUp1.png";
    }
    
    get left()   { return this.x; }
    get right()  { return this.x + 10; }
    get top()    { return this.y; }
    get bottom() { return this.y + 10; }

    draw(ctx){
        ctx.drawImage(
            this.sprite,
            this.x,
            this.y,
            27,
            20,
        );
    }

};