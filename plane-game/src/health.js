import powerUp from "./powerups.js";

export class health extends powerUp{
    constructor(x,y,){
        const img = new Image();
        img.src = "/Warhawk/assets/health.png";
        super(x,y, img, 20, 27, "health");
    }
    
    apply(player){
        player.hp = Math.min(player.hp + 20, player.maxHp);
    }
}