import * as Patterns from "./EnemyPattern.js";
import Enemy from "./Enemy.js";

export function spawnDiagonal(spawner){
 const frameImg = [];
        const straightImg = new Image();
        straightImg.src = "./src/engine/assets/straight.png";
        for(let i = 0; i < 1; i++){
          frameImg.push(straightImg);
        }

        const fromLeft = Math.random() < 0.5;
        const startX = fromLeft ? -50 : spawner.game.w + 50;
        const startY = Math.random() * spawner.game.h * 0.3;

        const angle = fromLeft ?  Math.PI/4 : (3 * Math.PI)/4;
        
        for(let i = 0; i < 6; i++){
          const enemy = new Enemy({
            x:startX, y:startY, w:60, h:60, game:spawner.game, frames:frameImg,
            speed:110,
            fireTimer: 4.0,
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
              for(let i = 0; i < 5; i++){

                if(flip == 1){
                    startX1 = 20;
                }else{
                    startX1 = spawner.game.w - 150;
                }
                const enemy = new Enemy({
                x:startX1, y:-50, game: spawner.game, frames: frameImg1, pattern:Patterns.zigZag, frameCount:5, 
                directionAngle: 0, angle: 0 
              })

                spawner.pending.push({
                  enemy,
                  delay: i * 3.0
                })
                
                flip *= -1;
            }
        return 6 * 3 + 2;
}

export function spawnCurve(spawner){
 const img_cent = new Image();

        img_cent.src = "src/engine/assets/airplane2_center.png";
        const framesImg3 = {
          center:img_cent,
        };

        const flipX  = Math.random() < 0.5;
        const flipY = Math.random() < 0.5;

        for(let i = 0; i < 6; i++){
           const enemy = new Enemy({
          x:Math.random() * spawner.game.w - 20, y:-50, w:60, h:60,
          game:spawner.game, fireTimer: 1.0, frames:framesImg3, pattern:Patterns.curved,
          directionAngle: flipY ? 0 : Math.PI,
          rotationMode: "curved"
        });
        
        enemy.curve ={
          t: 0,
          speed: 0.25,
          start: { x: Math.random() * spawner.game.w - 20, y : flipY ? -50 : spawner.game.h + -50},
          control: { x: flipX ? spawner.game.w * 1.0: spawner.game.w * 0.0, y: flipY ?  spawner.game.h * 0.1 : spawner.game.h * 0.1 },
          end: {x: spawner.game.w * 0.5, y: flipY ? spawner.game.h + 50 : -70}
        };
          spawner.pending.push({
            enemy,
            delay: i * 0.75
          })
        }

        return 5 * 0.75 + 2;
}

export function hover(spawner){
        const img = new Image();
        img.src = './src/engine/assets/boss.png';

        const frameImg4 = {
            center:img
        }

    const enemy = new Enemy({
        x:200, y:200, w:100, game:spawner.game, pattern:Patterns.hover, frames:frameImg4, directionAngle:0
    })

    spawner.pending.push({
        enemy,
        delay: 1.0
    })

    return 5;
}