export default class Background{
    constructor(){
        this.y = 0;
        this.backgroundImg = new Image();
        this.backgroundImg.src = "./src/engine/assets/background.png";
        this.speed = 70;
    }

    update(dt){
        this.y += this.speed * dt;
        if(this.y > 640){
            this.y = 0;
        }
    }



    draw(ctx){
        ctx.drawImage(this.backgroundImg, 0, this.y, 400, 640);
        ctx.drawImage(this.backgroundImg, 0, this.y - 640, 400, 640);
    }
};