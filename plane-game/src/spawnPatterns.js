import * as Patterns from "./EnemyPattern.js";
import Enemy from "./Enemy.js";
import {missile, spray} from "./shootingPatterns.js";
import { basic } from "./shootingPatterns.js";
import { burst } from "./shootingPatterns.js";
import EnemyBullet from "./EnemyBullet.js";


export function spawnStraight(spawner){
  const img = new Image();
  const sprites = [
    "/Warhawk/assets/sineCurve.png",
    "/Warhawk/assets/straight.png",
    "/Warhawk/assets/horizontal.png"
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];

  const frameS ={
    center:img
  };

  const count = [3, 4, 4, 4]
  const fromUp = Math.random() < 0.5;
  const starts = [
    {sx: 100, sy: fromUp ? spawner.game.h + - 50: -50},
    {sx:  300, sy:fromUp ? spawner.game.h + - 50: -50}
  ]

  const bursts = [1, 2, 2, 2];

  const colDelay = 4.0;

  for(let i = 0; i < starts.length; i++){
    const s = starts[i];
    for(let j = 0; j < count[spawner.diffIdx]; j++){
      const enemy = new Enemy({
        x: s.sx, y:s.sy, w:60, h:60, speed: 130,
        game:spawner.game, frames: frameS, shootingPattern:burst,
        burstRounds: bursts[spawner.diffIdx],
        pattern: Patterns.straight, fireTimer: 3.0,
        rotationMode: "straight",
        directionAngle: fromUp ? Math.PI : 0
      });

      

       if (spawner.pickUps.length > 0){
        if(spawner.pickUps[0] != 'missile'){
          enemy.dropPowerUp = spawner.pickUps[0];
        }else{
          enemy.dropPowerUp = spawner.pickUps.shift();
        }
        
      }

      enemy.vy = fromUp ? -1 : 1;
      spawner.pending.push({
        enemy,
        delay: i * colDelay + j * 1.0
      })
    }

   
  }

 
}

export function spawnHori(spawner){
  const img = new Image();
  const sprites = [
    "/Warhawk/assets/sineCurve.png",
    "/Warhawk/assets/straight.png",
    "/Warhawk/assets/horizontal.png"
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];

  const frames = {
    center:img
  }

  const sets =[
    [0],
    [-40, 40],
    [-70, 70]
  ]


  const fromLeft = Math.random() < 0.5;
  const goingUp = Math.random() < 0.5;
  const sx= fromLeft ? -50 :spawner.game.w + 50;
  const sy = Math.random() * (spawner.game.h * 0.5 - spawner.game.h * 0.25) + spawner.game.h * 0.25;

  let direction;
  const angle =  fromLeft ? goingUp ? -Math.PI/8 : Math.PI/4 : goingUp ? -(3 * Math.PI)/4 : (3 * Math.PI)/4;
  if (fromLeft && goingUp) {
        direction = -(Math.PI / 2);     
      }
      else if (fromLeft && !goingUp) {
        direction = -(Math.PI / 4) - 0.5;      
      }
      else if (!fromLeft && goingUp) {
        direction = (3 *Math.PI) / 4;
      }
      else {
        direction = -(3*Math.PI) / 4 + Math.PI + 0.5;
  }
  
  for(let j = 0; j < sets.length; j++){
    const y = sets[j];
    for(let i = 0; i < y.length; i++){
    const enemy = new Enemy({
      x:sx, y:sy + y[i], w:60, h:60, game:spawner.game, frames: frames,
      speed: 120, shootingPattern:basic, fireTimer: 2.5, 
      pattern: Patterns.diagonal, rotationMode:"diagonal",
      directionAngle: direction
    })

    enemy.diag ={
            vx: Math.cos(angle) * enemy.speed,
            vy: Math.sin(angle) * enemy.speed
        };
    spawner.pending.push({
      enemy,
      delay: j * 1.0 
    })
    }
  }
  
}
    
  


export function spawnDiagonal(spawner){
  const img = new Image();
  const sprites = [
    "/Warhawk/assets/sineCurve.png",
    "/Warhawk/assets/straight.png",
    "/Warhawk/assets/horizontal.png"
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];
        
    const frame = {
      center: img
    }
   const count = [3, 4, 4, 5];

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
            shootingPattern:basic,  shotType: "once",
            pattern:Patterns.diagonal,
            rotationMode: "diagonal",
            directionAngle: side.dir
          })
          
          enemy.diag ={
            vx: Math.cos(side.angle) * enemy.speed,
            vy: Math.sin(side.angle) * enemy.speed
          };
          
            if (spawner.pickUps.length > 0){
        if(spawner.pickUps[0] != 'missile'){
          enemy.dropPowerUp = spawner.pickUps[0];
        }else{
          enemy.dropPowerUp = spawner.pickUps.shift();
        }
        
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
                img.src = `/Warhawk/assets/heli${i}.png`;
                frameImg1.push(img);
            }
            
            const timerFire = [2.0, 1.0, 1.0, 1.0];
            const speed = [120, 135, 140, 140];
            
            
            let startX1 = 0; let flip = 1;
              for(let i = 0; i < 3; i++){

                if(flip == 1){
                    startX1 = Math.random() * (spawner.game.w * 0.75) + spawner.game.w * 0.25;
                }else{
                    startX1 = spawner.game.w - (Math.random() * (spawner.game.w * 0.75) + spawner.game.w * 0.25);
                }
                const enemy = new Enemy({
                x:startX1, y:-50, game: spawner.game, frames: frameImg1, pattern:Patterns.followPlayer, frameCount:5,
                fireTimer: timerFire[spawner.diffIdx],
                _followDist: Math.random() * 600 + 200,
                _followSpeed: speed[spawner.diffIdx],
                zigAmp: Math.random() * 60 + 60,
                shootingPattern: spray,
                directionAngle: 0
              })

                spawner.pending.push({
                  enemy,
                  delay: i * 2.0
                })
                
                flip *= -1;
            }

          

        return 3 * 3 + 2;
}

export function spawnCurve(spawner){
  const img = new Image();
  const sprites = [
    "/Warhawk/assets/airplane2_center.png",
    "/Warhawk/assets/airplane5.png",
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];
  const frames = {
    center:img
  }

        const flipX  = Math.random() < 0.5;
        const flipY = Math.random() < 0.5;
        const sx = (Math.random() * (spawner.game.w - 50))
        for(let i = 0; i < 5; i++){
           const enemy = new Enemy({
          x:sx, y:-50, w:60, h:60,
          game:spawner.game, fireTimer: 2.0, frames:frames, pattern:Patterns.curved,
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
        if(spawner.pickUps[0] != 'missile'){
          enemy.dropPowerUp = spawner.pickUps[0];
        }else{
          enemy.dropPowerUp = spawner.pickUps.shift();
        }
        
      }

          spawner.pending.push({
            enemy,
            delay: i * 0.75
          })
        }

       
        return 5 * 0.75 + 2;
}

export function  spawnSineCurve(spawner){
  const img = new Image();
  const sprites = [
     "/Warhawk/assets/airplane2_center.png",
    "/Warhawk/assets/airplane5.png",
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];
  const frames = {
    center:img
  }

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
          x:side.sx, y:side.sy, w:60, h:60, game:spawner.game, frames: frames,
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
        if(spawner.pickUps[0] != 'missile'){
          enemy.dropPowerUp = spawner.pickUps[0];
        }else{
          enemy.dropPowerUp = spawner.pickUps.shift();
        }
        
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
  const img = new Image();
  const sprites = [
     "/Warhawk/assets/airplane2_center.png",
    "/Warhawk/assets/airplane5.png",
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];
  
  const frames = {
    center:img
  }
  const count = spawner.diffIdx;
  
  if(count > 5){
    count = 3;
  }

  for(let j = 0; j < count; j++){
    const sx = Math.random() * (spawner.game.w * 0.75 ) + spawner.game.w * 0.25;
    const turn = Math.random() < 0.5;
    const fromUp = Math.random() < 0.5;
    const dirY = fromUp ? 1 : -1;

    for(let i = 0; i < 4; i ++){
    const sy = fromUp ? - 50 :  spawner.game.h;
    const enemy = new Enemy({
      x:sx, y:sy, w:60, h:60, game:spawner.game, frames: frames,
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

  spawner.pending.push({
    enemy,
    delay: j + i * 0.65
  });

  }
  }
  

  return 4 * 0.5 + 1;

}


export function spawnFromSide(spawner){
  const img = new Image();
  const sprites = [
     "/Warhawk/assets/airplane2_center.png",
    "/Warhawk/assets/airplane5.png",
  ]
  const randomIdx = Math.floor(Math.random() * sprites.length);
  img.src = sprites[randomIdx];
  
  const frames = {
    center:img
  }

  const count = [4, 5, 6, 6]

  const fromRight = Math.random() < 0.5;
  const sx = -50;
  const sy = Math.random() * (spawner.game.h * 0.75 - spawner.game.h * 0.25) + spawner.game.h * 0.25;
  for(let i = 0; i < count[spawner.diffIdx]; i ++){
    const enemy = new Enemy({
      x:sx, y:sy, w:60, h:60, game:spawner.game, frames: frames,
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
        if(spawner.pickUps[0] != 'missile'){
          enemy.dropPowerUp = spawner.pickUps[0];
        }else{
          enemy.dropPowerUp = spawner.pickUps.shift();
        }
        
      }


  spawner.pending.push({
    enemy,
    delay: i * 0.75
  });

  }



    
  return 4 * 0.4 + 2.0;
}


export function miniBoss(spawner){
  const sx = Math.random() * (spawner.game.w * 0.5)
  const sy = -50;

  const img = new Image();
  img.src = "/Warhawk/assets/boss.png"

  const framesMini = {
    center: img
  };

  const rounds = [10, 10, 12, 16];


  const enemy = new Enemy({
    x:sx, y:sy,w:190, h:130, hp:1500, game:spawner.game, frames:framesMini, 
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
  miniBoss2img.src = "/Warhawk/assets/boss2.png";

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