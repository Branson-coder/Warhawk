import Input from "./input.js";
import EntityManager from "./EntityManager.js";
import spawner from "../Spawner.js";
import Player  from "./player.js";
import powerUp from "../powerups.js"
import Background from "../Background.js";
import MenuScreen from "../MenuScreen.js";   // <-- ADD THIS IMPORT

import { Explosion } from "../Explosion.js";

export default class Game{
    constructor(canvas, ctx){
        this.canvas= canvas;
        this.ctx = ctx;
        this.w = canvas.width;
        this.h = canvas.height;

        this.input = new Input();
        this.lastTime = 0;
        this.running = false;
        this.score = 0;
        this.entities = new EntityManager();
        this.spawner = new spawner(this);
        this.player = new Player(this.w, this.h, this);
        this.entities.add(this.player);
        this.background = new Background();
        this.phase = "meun";

        this.explosionImg = [];
        for(let i = 1; i <= 16; i++){
            const temp = new Image();
            temp.src = `./src/engine/assets/explosions/${i}.png`;
            this.explosionImg.push(temp);
        }

        this.missileImage = new Image();
        this.missileImage.src = "./src/engine/assets/missilePickUp.png";
        this.bgm = new Audio("./src/engine/assets/bgm.mp3");
        this.bgm.loop = true;
        this.music = false;

        this.menu = new MenuScreen(canvas, ctx, this);
        this._menuLoop = this._menuLoop.bind(this);
        requestAnimationFrame(this._menuLoop);  
    }

    _menuLoop(timeStamp) {

        if (!this.menu.active) return;             // Game.start() was called — stop
        const dt = Math.min((timeStamp - (this._menuLastTime || timeStamp)) / 1000, 0.05);
        this._menuLastTime = timeStamp;

        this.menu.update(dt);

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.menu.draw(this.ctx);

        requestAnimationFrame(this._menuLoop);
    }

    start(){
        this.player.y = this.h + 80;
        if(!this.music){
            this.bgm.play().catch(() => {});
            this.music = true;
        }
        this.phase = "intro";
        this.running = true;
        this.lastTime = 0;
        
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timeStamp){
        if(!this.running) return;
        const dt = Math.min((timeStamp - this.lastTime)/ 1000 || 0, 0.05);
        this.lastTime = timeStamp;

        this.update(dt);
        this.draw(this.ctx);

        requestAnimationFrame(this.loop.bind(this));
    }


    update(dt){
        this.background.update(dt);

        if(this.phase == "intro"){
            this.player.y -= 200 * dt;
            
            
            if(this.player.y <= this.h * 0.5){
                this.player.y = this.h * 0.5;

                this.phase = "playing";
            }

            this.entities.update(dt, this);
            return;
        }
        if(this.phase === "playing"){
            this.spawner.update(dt);
            this.entities.update(dt, this);
            this.entities.resolveCollision(this);
            this.entities.cleanup();
        }

      
       
    }

    drawHUD(ctx) {
    const padding = 10;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.w, 48);

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${this.score}`, this.w - padding, 18);

    const missileIconSize = 18;
    const missileY = 26;
    const missileX = this.w - padding - 80;
    
    ctx.drawImage(
        this.missileImage,
        missileX,
        missileY,
        9,
        18
    );

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "left";
    ctx.fillText(
        `x ${this.player.missileCount}`,
        missileX + missileIconSize + 4,
        missileY + 14
    );

    const barX = padding;
    const barY = 14;
    const barW = 160;
    const barH = 16;

    const hpRatio = this.player.hp / this.player.maxHp;
    
    ctx.fillStyle = "#333";
    ctx.fillRect(barX, barY, barW, barH);

    ctx.fillStyle = hpRatio > 0.3 ? "#4cff4c" : "#ff4444";
    ctx.fillRect(barX, barY, barW * hpRatio, barH);

    ctx.strokeStyle = "white";
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.font = "12px monospace";
    ctx.fillText(
        `${Math.floor(hpRatio * 100)}%`,
        barX + barW + 8,
        barY + 12
    );
}

    
    draw(ctx){
        ctx.clearRect(0,0, this.w, this.h);
        this.background.draw(ctx); 
        this.entities.draw(ctx);

       if(this.phase === "playing"){
        this.drawHUD(ctx);
    }

    }
};