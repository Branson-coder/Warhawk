import * as Patterns from "./EnemyPattern.js";
import Enemy from "./Enemy.js";
import {spray} from "./shootingPatterns.js";
import { basic } from "./shootingPatterns.js";
import { burst } from "./shootingPatterns.js";


export function spawnStraight(spawner){
  const img = new Image();
  img.src = "./src/engine/assets/sineCurve.png";

  const frameS ={
    center:img
  };

  const count = [4, 5, 6, 6]
  const fromUp = Math.random() < 0.5;
  const starts = [
    {sx: 100, sy: fromUp ? spawner.game.h + - 50: -50},
    {sx:  300, sy:fromUp ? spawner.game.h + - 50: -50}
  ]

  const colDelay = 4.0;

  for(let i = 0; i < starts.length; i++){
    const s = starts[i];
    for(let j = 0; j < count[spawner.diffIdx]; j++){
      const enemy = new Enemy({
        x: s.sx, y:s.sy, w:60, h:60, speed: 130,
        game:spawner.game, frames: frameS, shootingPattern:basic,
        pattern: Patterns.straight, fireTimer: 3.0,
        rotationMode: "straight",
        directionAngle: fromUp ? Math.PI : 0
      });

      

       if (spawner.pickUps.length > 0){
    enemy.dropPowerUp = spawner.pickUps.shift();
  }

      enemy.vy = fromUp ? -1 : 1;
      spawner.pending.push({
        enemy,
        delay: i * colDelay + j * 1.0
      })
    }

   
  }

 
}


export function spawnDiagonal(spawner){
    const straightImg = new Image();
    straightImg.src = "./src/engine/assets/straight.png";
        
    const frame = {
      center: straightImg
    }
   const count = [4, 6, 8, 9, 10];

      const fromLeft = Math.random() < 0.5;
      const goingUp = Math.random() < 0.5;
      let direction;
      
      if(fromLeft){
        console.log("first coming from Left");
      }else{
        console.log("first coming from right");
      }
      if (fromLeft && goingUp) {
        direction = -(Math.PI / 2);     
      }
      else if (fromLeft && !goingUp) {
        direction = -(Math.PI / 4);      
      }
      else if (!fromLeft && goingUp) {
        direction = (3 *Math.PI) / 4;
      }
      else {
        direction = -(3*Math.PI) / 4 + Math.PI;
      }

      const firstSide = {
        sx: fromLeft ? -50 :spawner.game.w + 50,
        sy: Math.random() * (spawner.game.h * 0.5 - spawner.game.h * 0.25) + spawner.game.h * 0.25,
        angle: fromLeft ? goingUp ? -Math.PI/8 : Math.PI/4 : goingUp ? -(3 * Math.PI)/4 : (3 * Math.PI)/4,
        dir: direction
      };

      

      const secondSide = {
        sx: fromLeft ? spawner.game.w + 50 : -50,
        sy: spawner.game.h - firstSide.sy,
        angle: firstSide.angle + Math.PI,
        dir: firstSide.dir + Math.PI   
      };

      const sides = [
        firstSide, secondSide
      ];

      for(const side of sides){
         for(let i = 0; i < count[spawner.diffIdx]; i++){
          
          const enemy = new Enemy({
            x:side.sx, y:side.sy, w:60, h:60, game:spawner.game, frames:frame,
            speed:110,
            shootingPattern:basic, canShoot: Math.random() < 0.25, shotType: "once",
            pattern:Patterns.diagonal,
            rotationMode: "diagonal",
            directionAngle: side.dir
          })
          
          enemy.diag ={
            vx: Math.cos(side.angle) * enemy.speed,
            vy: Math.sin(side.angle) * enemy.speed
          };
          
           if (spawner.pickUps.length > 0){
            enemy.dropPowerUp = spawner.pickUps.shift();
          }
          spawner.pending.push({
            enemy,
            delay: i * 1.0
          })
        }
      }  
      
        return count[spawner.diffIdx] * 1.0 + 1;
}

export function spawnHeli(spawner){
     const frameImg1 = [];
            for(let i = 1; i <= 5; i++){
                const img = new Image();
                img.src = `./src/engine/assets/heli${i}.png`;
                frameImg1.push(img);
            }
            
            
            let startX1 = 0; let flip = 1, temp;
              for(let i = 0; i < 3; i++){

                if(flip == 1){
                    startX1 = Math.random() * (spawner.game.w * 0.75) + spawner.game.w * 0.25;
                }else{
                    startX1 = spawner.game.w - (Math.random() * (spawner.game.w * 0.75) + spawner.game.w * 0.25);
                }
                const enemy = new Enemy({
                x:startX1, y:-50, game: spawner.game, frames: frameImg1, pattern:Patterns.followPlayer, frameCount:5,
                fireTimer: 2.0,
                _followDist: Math.random() * 600 + 200,
                zigAmp: Math.random() * 60 + 60,
                shootingPattern: spray,
                directionAngle: 0, angle: 0 
              })

               if (spawner.pickUps.length > 0){
                enemy.dropPowerUp = spawner.pickUps.shift();
              }

                spawner.pending.push({
                  enemy,
                  delay: i * 2.0
                })
                
                flip *= -1;
            }

          

        return 3 * 3 + 2;
}

export function spawnCurve(spawner){
 const img_cent = new Image();

        img_cent.src = "src/engine/assets/airplane2_center.png";
        const framesImg3 = {
          center:img_cent,
        };

        const flipX  = Math.random() < 0.5;
        const flipY = Math.random() < 0.5;
        const sx = (Math.random() * (spawner.game.w - 50))
        for(let i = 0; i < 5; i++){
           const enemy = new Enemy({
          x:sx, y:-50, w:60, h:60,
          game:spawner.game, fireTimer: 2.0, frames:framesImg3, pattern:Patterns.curved,
          shootingPattern: burst,
          directionAngle: flipY ? 0 : Math.PI,
          rotationMode: "curved"
        });
        
       
        enemy.curve ={
          t: 0,
          speed: 0.25,
          start: { x: sx, y : flipY ? -50 : spawner.game.h + -50},
          control: { x: flipX ? spawner.game.w * 1.25: spawner.game.w * 0.0, y: flipY ?  spawner.game.h * 0.5 : spawner.game.h * 0.5 },
          end: {x: spawner.game.w * 0.5, y: flipY ? spawner.game.h + 50 : -70}
        };


          if (spawner.pickUps.length > 0){
    enemy.dropPowerUp = spawner.pickUps.shift();
  }

          spawner.pending.push({
            enemy,
            delay: i * 0.75
          })
        }

       
        return 5 * 0.75 + 2;
}

export function  spawnSineCurve(spawner){
  const img_mini = new Image();
  img_mini.src = "./src/engine/assets/airplane5.png";

  const frameImg5 = {
    center:img_mini,
  };
  
  const fromUp = Math.random() < 0.5;
  const fromUp2 = Math.random() < 0.5;
  const sides = [
    {sx: -50, sy: fromUp ? 10 : spawner.game.h + 10, left: 1},
    {sx: spawner.game.w + 20, sy: fromUp2 ? 10 : spawner.game.h + 10, left: 0}
  ]

 
  for(const side of sides){
    let dir, End;
    if(side.sy == 10){
      dir = 0;
      End = spawner.game.h + 70;
    }else{
      dir = Math.PI;
      End = -70;
    }
      for(let i = 0; i < 4; i ++){
        const enemy = new Enemy({
          x:side.sx, y:side.sy, w:60, h:60, game:spawner.game, frames: frameImg5,
          speed:110, fireTimer: 2.7,
          pattern:Patterns.curved,
          shootingPattern:basic,
          directionAngle: dir
        });

      
        enemy.curve = {
          t:0,
          speed:0.25,
          start: {x:side.sx, y :side.sy},
          control: {
            x: side.left == 1 ? spawner.game.w * 0.3 : spawner.game.w - spawner.game.w * 0.5,
            y:spawner.game.h * 0.3
          },
          end:{x:side.sx, y:End}
      };

       if (spawner.pickUps.length > 0){
    enemy.dropPowerUp = spawner.pickUps.shift();
  }

      spawner.pending.push({
        enemy,
        delay: i * 0.75
      });

      }
  }
  
  return 4 * 0.5 + 2;

}

export function  spawnRoller(spawner){
  const img_mini = new Image();
  img_mini.src = "./src/engine/assets/airplane3.png";

  const frameImg5 = {
    center:img_mini,
  };
  
  const count = spawner.diffIdx;
  
  if(count > 4){
    count = 4;
  }
  const colDelay = 3.0;
  for(let j = 0; j < count; j++){
    const sx = Math.random() * (spawner.game.w * 0.5 ) + spawner.game.w * 0.25;
    const turn = Math.random() < 0.5;
    const fromUp = Math.random() < 0.5;
    const dirY = fromUp ? 1 : -1;
    for(let i = 0; i < 4; i ++){
    const sy = fromUp ? - 50 :  spawner.game.h;
    const enemy = new Enemy({
      x:sx, y:sy, w:60, h:60, game:spawner.game, frames: frameImg5,
      speed:110, fireTimer: 3,
      pattern:Patterns.roller,
      shootingPattern:basic,
      directionAngle: fromUp ? 0 : Math.PI
    });

    enemy.curve = {
  t: 0,
  speed: 0.25,
  start: { x: sx, y: sy  },
  control1: { x: turn ? sx-200 :  sx+200, y:  sy+ dirY * 200}, 
  control2: { x:turn ? sx+200 : sx-200, y: sy+ dirY *300 }, 
  control3:{ x: turn ? sx-500 : sx+500, y:sy + dirY *380 },
  end: { x: sx, y: fromUp ? spawner.game.h + 50 : -70 } // exit point
};

  if (spawner.pickUps.length > 0){
    enemy.dropPowerUp = spawner.pickUps.shift();
  }


  spawner.pending.push({
    enemy,
    delay: j* colDelay + i * 0.65
  });

  }
  }
  

  return 4 * 0.5 + 1;

}


export function spawnFromSide(spawner){
  const img = new Image();
  img.src = "./src/engine/assets/airplane4.png";

  const frameImgSide = {
    center: img
  };

  const fromRight = Math.random() < 0.5;
  const sx = -50;
  const sy = Math.random() * (spawner.game.h * 0.75 - spawner.game.h * 0.25) + spawner.game.h * 0.25;
  for(let i = 0; i < 4; i ++){
    const enemy = new Enemy({
      x:sx, y:sy, w:60, h:60, game:spawner.game, frames: frameImgSide,
      speed:130, fireTimer: 5.0, shotType: "once",
      pattern:Patterns.curved,
      shootingPattern:basic, rotationMode: "side",
      directionAngle: fromRight ? Math.PI/2 : -Math.PI/2
    });

    const controlY = sy + (Math.random() < 0.5 ? -1 : 1) * 200;
    enemy.curve = {
      t:0,
      speed:0.35,
      start: {x: fromRight ? spawner.game.w - sx : sx, y :sy},
      control: {x: spawner.game.w * 0.3, y:controlY},
      end:{x: fromRight ? -100 : spawner.game.h + 50, y:sy}
  };

    if (spawner.pickUps.length > 0){
    enemy.dropPowerup = spawner.pickUps.shift();
  }

  spawner.pending.push({
    enemy,
    delay: i * 0.75
  });

  }



    
  return 4 * 0.4 + 2.0;
}


export function miniBoss(spawner){
  const sx = Math.random() * (spawner.game.w * 0.5);
  const sy = -50;

  const img = new Image();
  img.src = "./src/engine/assets/boss.png"

  const framesMini = {
    center: img
  };

  const rounds = [10, 10, 12, 16];

  const enemy = new Enemy({
    x:sx, y:sy,w:190, h:130, hp:1000, game:spawner.game, frames:framesMini, 
    pattern:Patterns.miniBoss2,
    directionAngle:0,
    speed:90,
    shootingPattern:burst, fireTimer:1.5, burstSpread: Math.PI/12,
    class: "miniBoss",
    burstRounds:rounds[spawner.diffIdx],
    directionAngle: Math.PI
  });

  spawner.pending.push({
    enemy,
    delay : 0
  });
  

  return 30;  
  
}


export function miniBoss2(spawner){
  const miniBoss2img = new Image();
  miniBoss2img.src = "./src/engine/assets/boss2.png";

  const frameMini2 ={
    center:miniBoss2img
  };

  const fromDown = Math.random() < 0.5;
  const enemy = new Enemy({
    x:spawner.game.w * 0.5, y: -50, w:180, h:130, game:spawner.game,
    speed:90,
    frames:frameMini2, pattern:Patterns.miniBoss2, 
    rotationMode:"miniBoss2"
  });

  spawner.pending.push({
    enemy,
    delay : 0
  });
  
  return 4;
}