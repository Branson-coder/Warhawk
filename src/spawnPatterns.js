import * as Patterns from "./EnemyPattern.js";
import Enemy from "./Enemy.js";
import {spray} from "./shootingPatterns.js";
import { basic } from "./shootingPatterns.js";
import { burst } from "./shootingPatterns.js";


export function spawnDiagonal(spawner){
 const frameImg = [];
        const straightImg = new Image();
        straightImg.src = "./src/engine/assets/straight.png";
        for(let i = 0; i < 1; i++){
          frameImg.push(straightImg);
        }

        const fromLeft = Math.random() < 0.5;
        const startX = fromLeft ? -50 : spawner.game.w + 50;
        const startY = Math.random() * (spawner.game.h * 0.75 - spawner.game.h * 0.25) + spawner.game.h*0.25
        const goingUp = Math.random() < 0.5;
        let angle;
        if(fromLeft){
          angle = goingUp ? -Math.PI/8 : Math.PI/4;
        }else{
          angle = goingUp ? -(3 * Math.PI)/8 : (3 * Math.PI)/4;
        }
        
        
        for(let i = 0; i < 6; i++){
          const enemy = new Enemy({
            x:startX, y:startY, w:60, h:60, game:spawner.game, frames:frameImg,
            speed:110,
            shootingPattern:basic, canShoot: Math.random() < 0.25,
            pattern:Patterns.diagonal,
            rotationMode: "diagonal",
            directionAngle: fromLeft ?  -Math.PI/2 : Math.PI/2
          })
          
          enemy.diag ={
            vx: Math.cos(angle) * enemy.speed,
            vy: Math.sin(angle) * enemy.speed
          };
          
          spawner.pending.push({
            enemy,
            delay: i * 1.0
          })
        }

        return 6 * 1.0 + 1;
}

export function spawnHeli(spawner){
     const frameImg1 = [];
            for(let i = 1; i <= 5; i++){
                const img = new Image();
                img.src = `./src/engine/assets/heli${i}.png`;
                frameImg1.push(img);
            }
            
            
            let startX1 = 0; let flip = 1;
              for(let i = 0; i < 3; i++){

                if(flip == 1){
                    startX1 = 20;
                }else{
                    startX1 = spawner.game.w - 150;
                }
                const enemy = new Enemy({
                x:startX1, y:-50, game: spawner.game, frames: frameImg1, pattern:Patterns.followPlayer, frameCount:5,
                zigAmp: Math.random() * 60 + 60, zigAmp: Math.random() * 100,
                shootingPattern: spray,
                directionAngle: 0, angle: 0 
              })

        

                spawner.pending.push({
                  enemy,
                  delay: i * 3.0
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

        for(let i = 0; i < 4; i++){
          const sx = (Math.random() * (spawner.game.w - 50))
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
          spawner.pending.push({
            enemy,
            delay: i * 0.75
          })
        }

        return 5 * 0.75 + 2;
}

export function  spawnSineCurve(spawner){
  const img_mini = new Image();
  img_mini.src = "./src/engine/assets/airplane3.png";

  const frameImg5 = {
    center:img_mini,
  };
 
  const fromLeft = Math.random() < 0.5;
  const sx = spawner.game.w - 50;
  const sy = 10;
  for(let i = 0; i < 4; i ++){
    const enemy = new Enemy({
      x:sx, y:sy, w:60, h:60, game:spawner.game, frames: frameImg5,
      speed:110, fireTimer: 3,
      pattern:Patterns.curved,
      shootingPattern:basic,
      directionAngle:0
    });

  
    enemy.curve = {
      t:0,
      speed:0.25,
      start: {x:sx, y :sy},
      control: {x: spawner.game.w * 0.3, y:spawner.game.h * 0.3},
      end:{x:sx, y:spawner.game.h + 50}
  };

  spawner.pending.push({
    enemy,
    delay: i * 0.75
  });

  }
    
  return 4 * 0.5 + 2;

}


export function miniBoss(spawner){
  const sx = Math.random() * spawner.game.w/2;
  const sy = -50;

  const img = new Image();
  img.src = "./src/engine/assets/boss.png"

  const framesMini = {
    center: img
  };

  const enemy = new Enemy({
    x:sx, y:sy,w:190, h:130, hp:1000, game:spawner.game, frames:framesMini, 
    pattern:Patterns.miniBoss,
    directionAngle:0,
    speed:60,
    shootingPattern:burst, fireTimer:1.5, burstSpread: Math.PI/12,
    burstRounds:10
  });

  spawner.pending.push({
    enemy,
    delay : 0
  });

  return 7;  
  
}
