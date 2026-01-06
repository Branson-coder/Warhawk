import Bullet from "../bullet.js"
import Collider from "../Collider.js";

export default class Player {
    constructor(GAME_W, GAME_H, game) {
        this.game = game;
        this.GAME_W = GAME_W;
        this.GAME_H = GAME_H;
        
        this.type = 'player';
        this.width = 60;
        this.height = 60;
        this.x = GAME_W/2 - this.width/2; this.y= GAME_H/2 - this.height - 20;
        this.speed = 200;

        this.fireRate = 0.12; this.fireTime = 0; 

        this.gunShot = new Audio('./src/engine/assets/playershot.mp3');
        this.snippetstart

        this.depsawn = false;
        this.collider = Collider;
        this.hp = 50;
        this.powerlvl = 0;
        this.shots = [
            [-3],
            [-8, 5],
            [-15, -3, 11],
            [-21, -15, -3, 11, 17]
        ];


        this.center = new Image();
        this.center.src = "./src/engine/assets/player_center.png";
        this.rightSprite = new Image();
        this.rightSprite.src = "./src/engine/assets/player_right.png";
        this.leftSprite = new Image();
        this.leftSprite.src = "./src/engine/assets/player_left.png";

        this.currentSprite = this.center;
    }

  

    update(dt, game) {
        const inp = game.input;
        let dx = 0, dy = 0;

        if(inp.isDown("ArrowLeft") || inp.isDown("a")) dx = -1;
        if(inp.isDown("ArrowRight") || inp.isDown("d")) dx = 1;
        if(inp.isDown("ArrowDown") || inp.isDown("s")) dy = 1;
        if(inp.isDown("ArrowUp") || inp.isDown("w")) dy = -1;

        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;

        if(dx < 0){
            this.currentSprite = this.leftSprite;
        }else if(dx > 0){
            this.currentSprite = this.rightSprite;

        }else{
            this.currentSprite = this.center;
        }
      

        this.fireTime -= dt;
        if(inp.isDown(" ") && this.fireTime <=0 ){
            this.fireTime = this.fireRate;
            this.shoot(game);
        }
    }

    shoot(game){
        const exits = this.shots[this.powerlvl];
        const cx = this.x + this.width/2;
        const cy = this.y;

        exits.forEach(element => {
            game.entities.add( 
                new Bullet(
                    cx + element,
                    cy,
                    1,
                    -500
                )
            );
             this.gunShot.currentTime = 1.9
             this.gunShot.play();
        });

    }

     draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";

        ctx.beginPath();
        ctx.ellipse(
        this.x + this.width / 2 + 6,   // center X
        this.y + this.height + 10,     // center Y
        this.width * 0.6,              // radius X
        this.height * 0.25,            // radius Y
        0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
         ctx.drawImage(
            this.currentSprite,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    get left()   { return this.x; }
    get right()  { return this.x + this.width; }
    get top()    { return this.y; }
    get bottom() { return this.y + this.height; }

    onCollision(other, game){
        if(other.type == 'enemyBullet'){
            other.despawn = true;
            this.hp -= 15;
            if(this.hp <= 0) this.despawn = true;
        }

        if(other.type == 'powerUp'){
            other.despawn = true
            this.powerlvl += 1;
        }
    }
    
}   
