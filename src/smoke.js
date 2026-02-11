export default class SmokeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = (Math.random() - 0.5) * 20;
    this.vy = 30 + Math.random() * 30;

    this.life = 0.8;   // seconds
    this.maxLife = this.life;

    this.size = 4 + Math.random() * 4;
    this.despawn = false;
  }

  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.life <= 0) this.despawn = true;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;

    ctx.fillStyle = `rgba(200,200,200,${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
}
