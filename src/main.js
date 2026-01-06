import Game from "./engine/GameEngine.js";
import Level1 from './levels/level1.js';


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);

    
game.start();