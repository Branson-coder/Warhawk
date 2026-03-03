import powerUp from "./powerups.js";
export class straightPower extends powerUp{
    constructor(x,y){
        const sprite = new Image();
        sprite.src = "/Warhawk/assets/powerUp1.png";
        super(x,y, sprite, 27, 20, "bulletPowerUp");
    }
    apply(player){
        player.powerlvl = Math.min(player.powerlvl + 1, player.straightShots.length);
        player.currShotType = "straight";
    }
}