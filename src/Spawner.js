import powerUp from "./powerups.js";
import * as funcs from "./spawnPatterns.js"

export default class Spawner {
  constructor(game) {
    this.game = game;
    this.script = [];
    this.currPattern = null;
    this.patternTimer = 0;
    this.patternDur = 0;

    this.powerUp = new powerUp();
    this.nextShotidx = 0;
    this.straights = [0, 35, 65, 90];
    this.nextHealthScore = 0;
    this.nextMissileScore = 10;
    this.picked = true;


    this.nextMiniBoss = 1;
    this.diffIdx = 0;
    this.levelScore = 10;
   
    this.pickUps = [];
    this.pending = [];
    this.patternBook = Object.values(funcs);
    this.activeEnemies = 0;

    console.log(funcs);
    console.log(this.patternBook);
//console.log(typeof this.patternBook[0]); // should print "function"
  }



  update(dt){
  if(this.activeEnemies < 0){
       //console.error("BUG: activeEnemies is negative!", this.activeEnemies);
       //console.trace(); // This will show you the call stack
       this.activeEnemies = 0; // Emergency reset
   }
   this.patternTimer += dt;
   this.updateEnemyNum();
   if(!this.currPattern) {
    //console.log("currPattern is null so calling startPattern");
    this.startPattern();
   }
  
   if(this.activeEnemies == 0 && this.pending.length == 0){
    //console.log("making currPattern null cuz activeEnemies = 0 && this.pending.length == 0");
    this.currPattern = null;
  }
  this.spawnPending(dt);
  
  if(this.game.score >= this.straights[this.nextShotidx]){
    this.pickUps.push('straightShot');
    this.nextShotidx = Math.min(this.nextShotidx + 1, this.straights.length);
    this.picked = false;
  }

  if(this.game.score >= this.nextHealthScore){
    this.pickUps.push('health');
    this.nextHealthScore += 9;
    this.picked = false;
  }

  if(this.game.score >= this.nextMissileScore){
    this.pickUps.push('missile');
    this.nextMissileScore *= 2;
  }



  }

  startPattern(){
    this.patternTimer = 0;
    let pick = 0;
    if(this.game.score > 0 && this.game.score >= this.nextMiniBoss){
      console.log("spawning miniBoss now");
      this.nextMiniBoss += 2 ;
      if(this.game.score < 1){
        pick = funcs.miniBoss;
        this.currPattern = pick;
        funcs.miniBoss(this);
      }else if(this.game.score <= 40){
        pick= funcs.miniBoss;
        this.currPattern = pick;
        funcs.miniBoss(this);
      }else{
        pick= funcs.miniBoss;
        this.currPattern = pick;
        funcs.miniBoss(this);
        funcs.spawnDiagonal(this);
      }
      
     
      return;
    }

      if(this.game.score < 10){
        const pool = [
          funcs.spawnDiagonal,
          funcs.spawnCurve,
          funcs.spawnHori,
          funcs.spawnStraight,
          funcs.spawnHeli
        ]

        pick = pool[Math.floor(Math.random() * pool.length)];
        this.currPattern = pick;
        pick(this);
        return; 

      }

      if(this.game.score < 25){
          const pool = [
          funcs.spawnDiagonal,
          funcs.spawnHori,
          funcs.spawnHeli,
          funcs.spawnFromSide,
          funcs.spawnCurve,
          funcs.spawnRoller,
          funcs.spawnRoller,
          funcs.spawnSineCurve,
          funcs.spawnSineCurve
        ]

        pick = pool[Math.floor(Math.random() * pool.length)];
        this.currPattern = pick;
        pick(this); 
        return; 
      }


      if(this.game.score < 50){
         const combo = Math.random();

         if(combo < 0.3){
          funcs.spawnCurve(this);
          funcs.spawnHori(this);
          this.currPattern = funcs.spawnCurve;

          return;
         }
          if(combo < 0.6){
          funcs.spawnStraight(this);
          funcs.spawnFromSide(this);
          this.currPattern = funcs.spawnDiagonal;

          return;
         }

         const pool = [
          funcs.spawnHeli,
          funcs.spawnRoller,
          funcs.spawnSineCurve,
        ];

        const pick = pool[Math.floor(Math.random() * pool.length)];

        this.currPattern = pick;
        pick(this);
        return;
          
      }

      if(this.game.score >= 50){
         const combo = Math.random();

         if(combo < 0.25){
          funcs.spawnCurve(this);
          funcs.spawnHori(this);
          this.currPattern = funcs.spawnCurve;

          return;
         }
          if(combo < 0.5){
          const heli = Math.random() < 0.5;
          if(heli){
            funcs.spawnHeli(this);
            funcs.spawnFromSide(this)
          }else{

          
            funcs.spawnStraight(this);
            funcs.spawnFromSide(this);
          }
          this.currPattern = funcs.spawnFromSide;

          return;
         }

         if(combo < 0.75){
          funcs.spawnSineCurve(this);
          funcs.spawnStraight(this);
          this.currPattern = funcs.spawnStraight;

          return;
         }

         if(combo < 1){
          funcs.spawnRoller(this);
          this.currPattern = funcs.spawnHeli;

          return;
         }
      }
      
    }

  spawnPending(dt){
      for(let i = this.pending.length - 1; i >= 0; i--){
      this.pending[i].delay -= dt;
      if(this.pending[i].delay <= 0){
        this.game.entities.add(this.pending[i].enemy);
        this.activeEnemies++;
        //console.log("Enemy spawned, activeEnemies++:", this.activeEnemies);
        const enemy = this.pending[i].enemy;
        this.pending.splice(i, 1);  
        
        enemy.onDeath = () => {
          this.activeEnemies--;
           //console.log("Enemy onDeath called, activeEnemies--:", this.activeEnemies, "dropPowerup:", enemy.dropPowerUp);
        }
      }
    }
  };

  updateEnemyNum(){
  if(this.game.score > 0 && this.game.score >= this.levelScore){
    this.levelScore += 15 + this.diffIdx * 20;
    this.diffIdx++;
    this.diffIdx = Math.min(this.diffIdx, 3);
  }
}

}
