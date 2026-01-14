import EnemyBullet from "./EnemyBullet.js";

const bullet1 = new Image();
bullet1.src = './src/engine/assets/bullet1.png';
const bullet2 = new Image();
bullet2.src = 'src/engine/assets/bullet2.png';

export function spawnBullet(game, enemy, dx, dy){
     if (!game || !game.player) return;
    const ex = enemy.x + enemy.w/2;
    const ey = enemy.y + enemy.h/2;

    const baseSpeed = 110;
    const enemySpeed = Math.hypot(enemy.vx || 0, enemy.vy || 0);  

    const finalSpeed = baseSpeed + enemySpeed * 0.5;

    const vx = dx * finalSpeed;
    const vy = dy * finalSpeed;

    let img = 0;    
    if(enemy.rotationMode == "diagonal"){
      img = bullet2;
    }else{
      img = bullet1;
    }

    const b = new EnemyBullet(ex - 3, ey - 3, vx, vy, img);
    game.entities.add(b);
    
}

export function basic(game, enemy){
    const px = game.player.x + game.player.width / 2;
    const py = game.player.y + game.player.height / 2;

    const ex = enemy.x + enemy.w / 2;
    const ey = enemy.y + enemy.h / 2;
  
   let dx = px - ex;
   let dy = py - ey;

   const len = Math.hypot(dx, dy) || 1;
   dx /= len;
   dy /= len;

   spawnBullet(game, enemy, dx, dy);

}

export function spray(game, enemy){
  const px = game.player.x + game.player.width/2;
  const py = game.player.y + game.player.height/2;

  const ex = enemy.x + enemy.w/2;
  const ey = enemy.y + enemy.h/2;

  let dx = px - ex;
  let dy = py - ey;

  const len = Math.hypot(dx, dy);
  dx /= len;
  dy /= len;

  const angle = Math.atan2(dy, dx);
  const spread = Math.PI/12;

  for(let i = -1; i <= 1; i++){
    let curr = angle + spread * i;

    const vx = Math.cos(curr) ;
    const vy = Math.sin(curr) ;

    spawnBullet(game, enemy, vx, vy);
    
  }
}

export function burst(game, enemy){
  const px = game.player.x + game.player.width/2;
  const py = game.player.y + game.player.height/2;

  const ex = enemy.x + enemy.w/2;
  const ey = enemy.y + enemy.h/2;

  let dx = px - ex;
  let dy = py - ey;

  const len = Math.hypot(dx, dy);
  dx /= len;
  dy /= len;
  
  enemy.burstQueue = [];
  for(let i = 0; i < 2; i++){
    enemy.burstQueue.push({dx, dy, delay:i * 0.1});
  }

  enemy.burstTimer = 0;
}