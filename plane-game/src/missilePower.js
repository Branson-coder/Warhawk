import powerUp from "./powerups.js";
export class missilePower extends powerUp{
    constructor(x,y){
        const img = new Image();
        img.src = "/Warhawk/assets/missilePickUp.png";
        super(x,y, img, 20, 27, "missile");
    }

    apply(player){
        player.missileCount += 2;
    }
}