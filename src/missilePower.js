import powerUp from "./powerups.js";
export class missilePower extends powerUp{
    constructor(x,y){
        const img = new Image();
        img.src = "./src/engine/assets/missilePickUp.png";
        super(x,y, img, 20, 27);
    }

    apply(player){
        player.missileCount += 100;
    }
}