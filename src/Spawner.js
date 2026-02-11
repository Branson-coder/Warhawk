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
    this.straights = [5, 25, 65, 90];
    this.nextHealthScore = 9;
    this.nextMissileScore = 2;


    this.nextMiniBoss = 10;
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
    this.patternTimer = 0;
   }
  
   if(this.activeEnemies == 0 && this.pending.length == 0){
    //console.log("making currPattern null cuz activeEnemies = 0 && this.pending.length == 0");
    this.currPattern = null;
  }
  this.spawnPending(dt);
  
  if(this.game.score >= this.straights[this.nextShotidx]){
    this.pickUps.push('straightShot');
    this.nextShotidx = Math.min(this.nextShotidx + 1, this.straights.length);
  }

  if(this.game.score >= this.nextHealthScore){
    this.pickUps.push('health');
    this.nextHealthScore += 9;
  }

  if(this.game.score >= this.nextMissileScore){
    this.pickUps.push('missile');
    this.nextHealthScore += 2;
  }



  }

  startPattern(){
    this.patternTimer = 0;
    let pick = 0;
    if(this.game.score > 0 && this.game.score >= this.nextMiniBoss){
      console.log("spawning miniBoss now");
      pick = funcs.miniBoss;
      this.currPattern = pick;
      this.patternDur = pick(this);

      this.nextMiniBoss += 15;
    }else{
      const availablePatterns = this.patternBook.filter(
      p => p !== funcs.miniBoss
    );
      pick = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
      this.currPattern = pick;
      this.patternDur = pick(this);
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
    this.levelScore += 10;
    this.diffIdx++;
    this.diffIdx = Math.min(this.diffIdx, 3);
  }
}

}
