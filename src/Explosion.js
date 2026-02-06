export class Explosion{
    constructor(x, y, img){
        this.x = x; 
        this.y = y;
        this.frame = 0;
        this.maxFrame = 16;
        this.timer = 0;
        this.inter = 0.01;
        this.images = img;
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

    draw(ctx){  
        ctx.drawImage(this.images[this.frame], this.x, this.y);

    }


};