import Input from "./input.js";
import EntityManager from "./EntityManager.js";
import spawner from "../Spawner.js";
import Player  from "./player.js";
import powerUp from "../powerups.js"
import Background from "../Background.js";
import MenuScreen from "../MenuScreen.js";
import GameOverScreen from "./GameOverScreen.js";

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
        this.gameOverScreen = null;
        this.phase = "menu";

        this.explosionImg = [];
        for(let i = 1; i <= 16; i++){
            const temp = new Image();
            temp.src = `/Warhawk/assets/explosions/${i}.png`;
            this.explosionImg.push(temp);
        }

        this.missileImage = new Image();
        this.missileImage.src = "/Warhawk/assets/missilePickUp.png";
        this.bgm = new Audio("/Warhawk/assets/bgm.mp3");
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

        this.player.onDeath = () => {
            this.handlePlayerDeath();
        };
    
        this.phase = "intro";
        this.running = true;
        this.lastTime = 0;
        
        requestAnimationFrame(this.loop.bind(this));
    }

    handlePlayerDeath() {
        console.log("Player died! Final score:", this.score);
        
        if (this.spawner) {
            this.spawner.stopSpawning();
        }
        
        setTimeout(() => {
            this.phase = 'gameover';
            this.gameOverScreen = new GameOverScreen(this.canvas, this.ctx, this, this.score);
        }, 1500);
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

         if(this.phase === "gameover"){
            if(this.gameOverScreen){
                this.gameOverScreen.update(dt);
            }
            this.entities.update(dt, this);
        }
       
    }

    drawHUD(ctx) {
    const padding = 10;
    const barH = 52;
    const grad = ctx.createLinearGradient(0, 0, 0, barH);
    grad.addColorStop(0,   'rgba(20,18,12,0.92)');
    grad.addColorStop(0.5, 'rgba(28,24,16,0.88)');
    grad.addColorStop(1,   'rgba(20,18,12,0.92)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.w, barH);

    // Metal rivets
    const rivetY = [8, barH - 8];
    const rivetX = [12, this.w / 2 - 60, this.w / 2 + 60, this.w - 12];
    ctx.save();
    for (const rx of rivetX) {
        for (const ry of rivetY) {
            ctx.beginPath();
            ctx.arc(rx, ry, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(60,50,30,0.8)';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(rx - 1, ry - 1, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140,120,80,0.4)';
            ctx.fill();
        }
    }
    ctx.restore();

    // Top edge highlight
    ctx.strokeStyle = 'rgba(100,80,50,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 1);
    ctx.lineTo(this.w, 1);
    ctx.stroke();

    // Bottom edge shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.moveTo(0, barH - 1);
    ctx.lineTo(this.w, barH - 1);
    ctx.stroke();

    // ── HP Bar (left side) ──────────────────────────────────────────────────
    const barX = padding + 4;
    const barY = 16;
    const barW = 180;
    const barH2 = 20;
    const hpRatio = this.player.hp / this.player.maxHp;

    // Label above bar
    ctx.save();
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(200,180,120,0.7)';
    ctx.fillText('HULL INTEGRITY', barX, barY - 2);
    ctx.restore();

    // Outer frame
    ctx.fillStyle = 'rgba(40,35,25,0.9)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH2 + 4);

    // Inner background
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(barX, barY, barW, barH2);

    // HP fill with gradient
    const hpGrad = ctx.createLinearGradient(barX, barY, barX, barY + barH2);
    if (hpRatio > 0.5) {
        hpGrad.addColorStop(0, '#6fb368');
        hpGrad.addColorStop(1, '#4a8c45');
    } else if (hpRatio > 0.3) {
        hpGrad.addColorStop(0, '#d4a54e');
        hpGrad.addColorStop(1, '#b88a3c');
    } else {
        hpGrad.addColorStop(0, '#c84a3c');
        hpGrad.addColorStop(1, '#a03428');
    }
    ctx.fillStyle = hpGrad;
    ctx.fillRect(barX, barY, barW * hpRatio, barH2);

    // Segments / tick marks
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
        const x = barX + (barW / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, barY);
        ctx.lineTo(x, barY + barH2);
        ctx.stroke();
    }

    // Border
    ctx.strokeStyle = 'rgba(120,100,60,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX + 0.5, barY + 0.5, barW - 1, barH2 - 1);

    // HP percentage text
    ctx.save();
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = hpRatio > 0.3 ? '#f0e8cc' : '#ffddcc';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 3;
    ctx.fillText(`${Math.floor(hpRatio * 100)}%`, barX + barW / 2, barY + barH2 / 2);
    ctx.restore();

    // ── Missiles (right side, upper) ────────────────────────────────────────
    const missileX = this.w - padding - 60;
    const missileY = 8;

    // Panel background
    ctx.fillStyle = 'rgba(40,35,25,0.7)';
    ctx.fillRect(missileX - 4, missileY - 2, 88, 24);
    ctx.strokeStyle = 'rgba(120,100,60,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(missileX - 3.5, missileY - 1.5, 87, 23);

    ctx.save();
    ctx.font = 'bold 8px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(200,160,80,0.65)';
    ctx.fillText('ORDNANCE', missileX, missileY);
    ctx.restore();

    // Missile icon
    ctx.drawImage(this.missileImage, missileX + 2, missileY + 9, 8, 12);

    // Count
    ctx.save();
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.player.missileCount > 0 ? '#f0e8cc' : 'rgba(160,140,100,0.5)';
    ctx.fillText(`× ${this.player.missileCount}`, missileX + 16, missileY + 15);
    ctx.restore();

    // ── Score (right side, lower) ───────────────────────────────────────────
    const scoreY = 32;
    
    ctx.save();
    ctx.font = '9px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(200,180,120,0.6)';
    ctx.fillText('SCORE', this.w - padding - 4, scoreY);

    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#e8d8a0';
    ctx.shadowColor = 'rgba(200,160,80,0.4)';
    ctx.shadowBlur = 6;
    ctx.fillText(this.score.toString().padStart(6, '0'), this.w - padding - 4, scoreY + 9);
    ctx.restore();
}
    
    draw(ctx){
        ctx.clearRect(0,0, this.w, this.h);
        this.background.draw(ctx); 
        this.entities.draw(ctx);

       if(this.phase === "playing"){
        this.drawHUD(ctx);
    }

    if (this.phase === 'gameover' && this.gameOverScreen) {
        this.gameOverScreen.draw(ctx);
    }

    }
};