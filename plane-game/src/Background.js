function drawCloud(ctx, x, y, size) {
  // main body
  let g = ctx.createRadialGradient(x, y, size * 0.15, x, y, size);
  g.addColorStop(0, "rgba(255,255,255,0.85)");
  g.addColorStop(0.6, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  // left puff
  g = ctx.createRadialGradient(x - size * 0.6, y + size * 0.1, size * 0.15, x - size * 0.6, y + size * 0.1, size * 0.7);
  g.addColorStop(0, "rgba(255,255,255,0.75)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x - size * 0.6, y + size * 0.1, size * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // right puff
  g = ctx.createRadialGradient(x + size * 0.6, y + size * 0.1, size * 0.15, x + size * 0.6, y + size * 0.1, size * 0.7);
  g.addColorStop(0, "rgba(255,255,255,0.75)");
  g.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x + size * 0.6, y + size * 0.1, size * 0.7, 0, Math.PI * 2);
  ctx.fill();
}
export default class Background{
    constructor(){
        this.y = 0;
        this.backgroundImg = new Image();
        this.backgroundImg.src = "/Warhawk/assets/background.png";
        this.speed = 70;

        this.clouds = Array.from({ length: 7 }, () => ({
        x: Math.random() * 400,
        y: Math.random() * 640,
        size: 30 + Math.random() * 40,
        speed: 30 + Math.random() * 40
        }));
    }

    

    update(dt){
        this.y += this.speed * dt;
        if(this.y > 640){
            this.y = 0;
        }

        for (const c of this.clouds) {
        c.y += c.speed * dt;
        if (c.y > 700) {
        c.y = -c.size;
        c.x = Math.random() * 400;
        }
    }
    }



    draw(ctx){
        ctx.drawImage(this.backgroundImg, 0, this.y, 400, 640);
        ctx.drawImage(this.backgroundImg, 0, this.y - 640, 400, 640);

          for (const c of this.clouds) {
            drawCloud(ctx, c.x, c.y, c.size, 0.4);
        }
    }
};