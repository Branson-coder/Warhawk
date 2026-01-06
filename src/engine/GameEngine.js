import Input from "./input.js";
import EntityManager from "./EntityManager.js";
import spawner from "../Spawner.js";
import Player  from "./player.js";
import Background from "../Background.js";

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
    }


    start(){
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
    
    draw(ctx){
        ctx.clearRect(0,0, this.w, this.h);
        this.background.draw(ctx); 
        this.entities.draw(ctx);

        ctx.fillStyle = 'white';
        ctx.font = '14px monospace';
        ctx.fillText('Score: ' + (this.score), 10, 18);

        
    }
};