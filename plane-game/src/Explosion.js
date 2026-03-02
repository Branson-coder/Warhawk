import Collider from "./Collider.js";
export class Explosion{
    constructor(x, y, img, w, h, t){
        this.type = 'explosion'; this.t = t;
        this.x = x; 
        this.y = y;
        this.w = w; this.h = h;
        this.frame = 0;
        this.maxFrame = 16;
        this.timer = 0;
        this.inter = 0.03;
        this.images = img;
        this.collider = Collider;
        this.despawn = false;
    };

    update(dt){
        this.timer += dt;

        if(this.timer > this.inter){
            this.frame++;
            this.timer = 0;

            if(this.frame >= this.maxFrame){
                this.despawn = true;
            }
        }
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

    draw(ctx){  
        ctx.drawImage(this.images[this.frame], this.x, this.y, this.w, this.h);

    }


};