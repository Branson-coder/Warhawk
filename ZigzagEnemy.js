import { Enemy } from "./Enemy.js";

export class ZigZag extends Enemy{
    constructor(x, y){
        super({x,y, w: 20, h: 30, colour: "purple"});
        this.angle = 0;
    }

    update(dt){
        this.x += Math.sin(this.angle)* 200 * dt;
        this.angle += 3* dt;
        super.update(dt);
    }

   
    
}