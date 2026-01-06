import { Enemy } from "./Enemy.js";
export class Swoop extends Enemy {
    constructor(startX, startY, targetX, targetY) {
        super({ x: startX, y: startY, color: "purple", w: 40, h: 40, speed: 150 });

        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.elapsed = 0;
        this.duration = 2; // seconds to reach target
    }

    update(dt) {
        this.elapsed += dt;
        const t = this.elapsed / this.duration;

        if (t >= 1) {
            this.despawn = true;
            return;
        }

        // linear interpolation plus a curve in X
        this.x = this.startX + (this.targetX - this.startX) * t;
        this.y = this.startY + (this.targetY - this.startY) * t + 50 * t * (1 - t); // swoop curve
        super.update(dt);
    }
}

  handleEvent(ev) {
    if (!ev) return;
    if (ev.type === "spawn") {
      const baseX = ev.x ?? 40;
      const spacing = ev.spacing ?? 48;
      for (let i = 0; i < (ev.count || 1); i++) {
        const x = baseX + i * spacing;
        const y = ev.y ?? -30 - i * 10;

        // choose pattern function by name (match these names in EnemyPattern.js)
        let patternFn = Patterns.straightDown;
        if (ev.pattern === "zig") patternFn = Patterns.zigZag;
        else if (ev.pattern === "sine") patternFn = Patterns.sineWave;
        else if (ev.pattern === "dive") patternFn = Patterns.diveThenExit;
        else if (ev.pattern === "hover") patternFn = Patterns.hover;
        else if (ev.pattern === "arc") patternFn = Patterns.arcEntrance;
        else if (ev.pattern === "follow") patternFn = Patterns.followPlayer;

        const enemy = new Enemy({
          x,
          y,
          game: this.game,
          pattern: patternFn,
          colour: ev.colour || "blue",
          hp: ev.hp ?? 60,
        });

        // apply pattern-specific tunables
        if (ev.pattern === "zig") {
          enemy._zigFreq = ev.zigFreq ?? 3;
          enemy._zigAmp = ev.zigAmp ?? 80;
        }
        if (ev.pattern === "sine") {
          enemy._sineFreq = ev.sineFreq ?? 2.5;
          enemy._sineAmp = ev.sineAmp ?? 70;
        }
        if (ev.pattern === "dive") {
          enemy._diveTime = ev.diveTime ?? 1.2;
          enemy._diveSpeed = ev.diveSpeed ?? 260;
          enemy._targetX =
            ev.targetX ?? (this.game.player ? this.game.player.x + this.game.player.width / 2 : this.game.w / 2);
          enemy._targetY =
            ev.targetY ?? (this.game.player ? this.game.player.y + this.game.player.height / 2 : this.game.h - 120);
        }
        if (ev.pattern === "hover") {
          enemy._hoverBaseY = ev.hoverBaseY ?? this.game.h * 0.2 + Math.random() * 40;
          enemy._hoverFreq = ev.hoverFreq ?? 0.9;
          enemy._hoverAmp = ev.hoverAmp ?? 28;
        }
        if (ev.pattern === "arc") {
          enemy._arcCenterX = ev.arcCenterX ?? x;
          enemy._arcCenterY = ev.arcCenterY ?? 80;
          enemy._arcRadius = ev.arcRadius ?? 120;
          enemy._arcSpeed = ev.arcSpeed ?? 1.0;
        }
        if (ev.pattern === "follow") {
          enemy._followSpeed = ev.followSpeed ?? 140;
        }

        this.game.entities.add(enemy);
      }
    } else if (ev.type === "spawnWave") {
      for (let i = 0; i < (ev.count || 1); i++) {
        const angle = (i / Math.max(ev.count - 1, 1)) * Math.PI - Math.PI / 2;
        const x = ev.cx + Math.cos(angle) * (ev.radius ?? 80);
        const y = ev.cy + Math.sin(angle) * (ev.radius ?? 80) - 60;
        const enemy = new Enemy({
          x,
          y,
          game: this.game,
          pattern: ev.patternFn || Patterns.sineWave,
          colour: ev.colour,
        });
        this.game.entities.add(enemy);
      }
    }
    // TODO: add boss/powerup events here
  }
}
