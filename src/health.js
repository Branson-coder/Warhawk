import powerUp from "./powerups.js";

export class health extends powerUp{
    constructor(x,y,){
        const img = new Image();
        img.src = "./src/engine/assets/health.png";
        super(x,y, img, 20, 27);
    }
    
    apply(player){
        player.hp = Math.min(player.hp + 15, player.maxHp);
    }
}