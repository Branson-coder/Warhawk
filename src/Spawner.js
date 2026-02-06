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
    this.powerUpSpawns = false;
    this.nextPowerUpScore = 5;
    this.nextMiniBoss = 10;
   
    
    this.pending = [];
    this.patternBook = Object.values(funcs);
    this.activeEnemies = 0;

    console.log(funcs);
    console.log(this.patternBook);
//console.log(typeof this.patternBook[0]); // should print "function"
  }



  update(dt){
   this.patternTimer += dt;

   if(!this.currPattern) {
    this.startPattern();
    this.patternTimer = 0;
   }
   
   if(this.activeEnemies == 0 && this.pending.length == 0){
    this.currPattern = null;
  }
  this.spawnPending(dt);
  
  if(this.game.score >= this.nextPowerUpScore && !this.powerUpSpawns){
    this.powerUpSpawns = true;
    this.nextPowerUpScore += 15;
  }

  }

  startPattern(){
    this.patternTimer = 0;
    let pick = 0;
    if(this.game.score > 0 && this.game.score >= this.nextMiniBoss){
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
        const enemy = this.pending[i].enemy;
        this.pending.splice(i, 1);  
        
        enemy.onDeath = () => {
          this.activeEnemies--;
        }
      }
    }
  }

  spawnPowerUp(x, y){
    
  }

}
