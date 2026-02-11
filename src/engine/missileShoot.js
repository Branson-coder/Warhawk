export class missileShoot{
    constructor(x,y){
        this.x = x; this.y = y;
        this.w = 12; this.h = 48;
        this.speed = 180;
        this.despawn = false;

        this.img = new Image();
        this.img.src = "./src/engine/assets/missile.png";
    }

    update(dt){
        this.y -= dt * this.speed;

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
};