export function diagonal(en, dt, game) {
  en.x += en.diag.vx * dt;
  en.y += en.diag.vy * dt;
  
}

export function zigZag(en, dt, game) {
  en.x += Math.sin(en.timeAlive * (en._zigFreq ?? 7)) * (en._zigAmp ?? 100) * dt;
  en.y += en.speed * dt;
}

export function curved(en, dt, game){
  const c = en.curve;
  if (!c) return;

  c.t += c.speed * dt;
  if (c.t > 1) c.t = 1;

  const t = c.t;
  const u = 1 - t;

  en.x =
    u * u * c.start.x +
    2 * u * t * c.control.x +
    t * t * c.end.x;

  en.y =
    u * u * c.start.y +
    2 * u * t * c.control.y +
    t * t * c.end.y;  
}

export function straight(en, dt, game) {
  en.x += Math.sin(en.timeAlive * (en._sineFreq ?? 2.5)) * (en._sineAmp ?? 60) * dt;
  en.y += en.speed * dt;
}

export function diveThenExit(en, dt, game) {
  if (en.timeAlive < (en._diveTime ?? 1.2)) {
    // interpolate toward target
    const tx = en._targetX ?? (game.player ? game.player.x + game.player.width / 2 : game.w / 2);
    const ty = en._targetY ?? (game.player ? game.player.y + game.player.height / 2 : game.h - 120);
    const t = en.timeAlive / (en._diveTime ?? 1.2);
    // simple lerp
    en.x += (tx - (en.x + en.w / 2)) * Math.min(1, (dt * 2));
    en.y += (ty - (en.y + en.h / 2)) * Math.min(1, (dt * 2));
  } else {
    // exit downward fast
    en.y += (en._diveSpeed ?? 260) * dt;
  }
}

export function hover(en, dt, game) {
  // hover at a base Y and bob left-right slightly
  en.y = (en._hoverBaseY ?? en.y) + Math.sin(en.timeAlive * (en._hoverFreq ?? 0.9)) * (en._hoverAmp ?? 28);
  en.x += Math.sin(en.timeAlive * 2.0) * 60 * dt;
}

export function arcEntrance(en, dt, game) {
  // move along a circular arc centered at _arcCenterX/_arcCenterY
  en.timeParam += dt * (en._arcSpeed ?? 1.0);
  const cx = en._arcCenterX ?? en.x;
  const cy = en._arcCenterY ?? en.y;
  const r = en._arcRadius ?? 120;
  en.x = cx + Math.cos(en.timeParam) * r;
  en.y = cy + Math.sin(en.timeParam) * r * 0.5 + (en.timeAlive * 10);
}

export function followPlayer(en, dt, game) {
  if (!game || !game.player) {
    en.y += en.speed * dt;
    return;
  }
  // move toward player's current position slowly
  const px = game.player.x + game.player.width / 2;
  const py = game.player.y + game.player.height / 2;
  let dx = px - (en.x + en.w / 2);
  let dy = py - (en.y + en.h / 2);
  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;
  en.x += dx * (en._followSpeed ?? 120) * dt;
  en.y += dy * (en._followSpeed ?? 120) * dt;
}

