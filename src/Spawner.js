import powerUp from "./powerups.js"
import * as funcs from "./spawnPatterns.js"

export default class Spawner {
  constructor(game) {
    this.game = game;
    this.script = [];
    this.currPattern = null;
    this.patternTimer = 0;
    this.patternDur = 0;
    
    this.pending = [];
    this.patternBook = Object.values(funcs);
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
   
   if(this.patternTimer > this.patternDur){
    this.currPattern = null;
  }
  this.spawnPending(dt);
  

  }

  startPattern(){
    this.patternTimer = 0;
    const pick = this.patternBook[Math.floor(Math.random() * this.patternBook.length)];
    this.currPattern = pick;

    this.patternDur= pick(this);

  } 

  spawnPending(dt){
      for(let i = this.pending.length - 1; i >= 0; i--){
      this.pending[i].delay -= dt;
      if(this.pending[i].delay <= 0){
        this.game.entities.add(this.pending[i].enemy);
        this.pending.splice(i, 1);
          console.log("yo i spawned");
      }
    }
  }


}
