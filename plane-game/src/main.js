import Game from "./engine/GameEngine.js";


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);
