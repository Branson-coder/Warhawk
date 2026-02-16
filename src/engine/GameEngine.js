import Input from "./input.js";
import EntityManager from "./EntityManager.js";
import spawner from "../Spawner.js";
import Player  from "./player.js";
import powerUp from "../powerups.js"
import Background from "../Background.js";

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

        this.explosionImg = [];
        for(let i = 1; i <= 16; i++){
            const temp = new Image();
            temp.src = `./src/engine/assets/explosions/${i}.png`;
            this.explosionImg.push(temp);
        }

        this.bgm = new Audio("./src/engine/assets/bgm.mp3");
        this.bgm.loop = true;
        this.music = false;
    }


    start(){

        if(!this.music){
            this.bgm.play().catch(() => {});
            this.music = true;
        }

        this.running = true;
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
        this.spawner.update(dt);
        
        this.entities.update(dt, this);
        this.entities.resolveCollision(this);
        this.entities.cleanup();
       
    }

    drawHUD(ctx) {
    const padding = 10;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.w, 48);

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${this.score}`, this.w - padding, 18);

    const barX = padding;
    const barY = 14;
    const barW = 160;
    const barH = 16;

    const hpRatio = this.player.hp / this.player.maxHp;
    
    ctx.fillStyle = "#333";
    ctx.fillRect(barX, barY, barW, barH);

    // bar fill
    ctx.fillStyle = hpRatio > 0.3 ? "#4cff4c" : "#ff4444";
    ctx.fillRect(barX, barY, barW * hpRatio, barH);

    ctx.strokeStyle = "white";
    ctx.strokeRect(barX, barY, barW, barH);

    // HP text
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

       // ===== HUD =====
        this.drawHUD(ctx);

        
    }
};