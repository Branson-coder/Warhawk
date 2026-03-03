export default class MenuScreen {
    constructor(canvas, ctx, game) {
        this.canvas = canvas;
        this.ctx  = ctx;
        this.game  = game;
        this.w = canvas.width;
        this.h  = canvas.height; 

        this.active = true;
        this.screen = 'main'; // 'main' | 'help'
        this.time   = 0;
        this.click = new Audio("/Warhawk/assets/click.mp3");
        this.click.volume = 1.0;


        this.buttons = {
            main: [
                { label: 'FIGHT',    action: 'start', y: 0 },
                { label: 'BRIEFING',    action: 'help',  y: 0 },
                { label: 'LEAVE',  action: 'exit',  y: 0 },
            ],
            help: [
                { label: '< RETURN',    action: 'back',  y: 0 },
            ]
        };
        this.hoveredBtn = null;

        // ── Blink ────────────────────────────────────────────────────────
        this.blinkTimer = 0;
        this.blinkOn    = true;
        this.lights = [
            { angle: -0.6, speed:  0.22, x: this.w * 0.18 },
            { angle:  0.5, speed: -0.18, x: this.w * 0.82 },
        ];
        this.ash = Array.from({ length: 60 }, () => this._newAsh(true));

        this._paper = this._bakePaper(400, 300);

        this._onMove  = this._onMove.bind(this);
        this._onClick = this._onClick.bind(this);
        canvas.addEventListener('mousemove', this._onMove);
        canvas.addEventListener('click',     this._onClick);
    }


    _bakePaper(w, h) {
        const c   = document.createElement('canvas');
        c.width   = w; c.height = h;
        const ctx = c.getContext('2d');

        // Base — aged parchment
        ctx.fillStyle = '#1a1508';
        ctx.fillRect(0, 0, w, h);

        // Grain
        const id = ctx.createImageData(w, h);
        for (let i = 0; i < id.data.length; i += 4) {
            const n = (Math.random() * 28) | 0;
            id.data[i]     = 30  + n;
            id.data[i + 1] = 24  + n;
            id.data[i + 2] = 10  + (n >> 1);
            id.data[i + 3] = 180 + (Math.random() * 60 | 0);
        }
        ctx.putImageData(id, 0, 0);

        // Horizontal wear lines
        for (let y = 0; y < h; y += 3 + Math.random() * 8 | 0) {
            ctx.fillStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.1})`;
            ctx.fillRect(0, y, w, 1);
        }

        // Dark splotches
        for (let i = 0; i < 18; i++) {
            const sx = Math.random() * w;
            const sy = Math.random() * h;
            const r  = 10 + Math.random() * 40;
            const g  = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
            g.addColorStop(0, `rgba(0,0,0,${0.08 + Math.random() * 0.12})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
        }

        return c;
    }


    _newAsh(scatter = false) {
        return {
            x:     Math.random() * this.w,
            y:     scatter ? Math.random() * this.h : -6,
            vx:    (Math.random() - 0.5) * 14,
            vy:    25 + Math.random() * 55,
            size:  1 + Math.random() * 2,
            alpha: 0.1 + Math.random() * 0.3,
            flick: Math.random() * Math.PI * 2,
        };
    }


    _btnW()  { return 230; }
    _btnH()  { return 40; }
    _btnX()  { return (this.w - this._btnW()) / 2; }

    _layout(screen) {
        const list = this.buttons[screen];
        const gap  = 52;
        const top  = screen === 'help' ? this.h * 0.74 : this.h * 0.575;
        list.forEach((b, i) => { b.y = top + i * gap; });
    }


    _hit(mx, my, b) {
        const bx = this._btnX();
        return mx >= bx && mx <= bx + this._btnW() &&
               my >= b.y && my <= b.y + this._btnH();
    }

    _onMove(e) {
        if (!this.active) return;
        const r  = this.canvas.getBoundingClientRect();
        const mx = (e.clientX - r.left) * (this.w / r.width);
        const my = (e.clientY - r.top)  * (this.h / r.height);
        this.hoveredBtn = this.buttons[this.screen].find(b => this._hit(mx, my, b)) || null;
        this.canvas.style.cursor = this.hoveredBtn ? 'pointer' : 'default';
    }

    _onClick(e) {
        if (!this.active) return;
        this.click.currentTime = 0.07;
        this.click.play();
        const r  = this.canvas.getBoundingClientRect();
        const mx = (e.clientX - r.left) * (this.w / r.width);
        const my = (e.clientY - r.top)  * (this.h / r.height);
        const hit = this.buttons[this.screen].find(b => this._hit(mx, my, b));
        if (!hit) return;
        switch (hit.action) {
            case 'start': this.destroy(); this.game.start(); break;
            case 'help':  this.screen = 'help'; this.hoveredBtn = null; break;
            case 'back':  this.screen = 'main'; this.hoveredBtn = null; break;
            case 'exit':  window.close(); break;
        }
    }

    destroy() {
        this.active = false;
        this.canvas.removeEventListener('mousemove', this._onMove);
        this.canvas.removeEventListener('click',     this._onClick);
        this.canvas.style.cursor = 'default';
    }


    update(dt) {
        if (!this.active) return;
        this.time += dt;

        this.blinkTimer += dt;
        if (this.blinkTimer > 0.5) { this.blinkTimer = 0; this.blinkOn = !this.blinkOn; }

        for (const l of this.lights) {
            l.angle += l.speed * dt;
            // Bounce between limits
            if (l.angle >  1.1) l.speed = -Math.abs(l.speed);
            if (l.angle < -1.1) l.speed =  Math.abs(l.speed);
        }

        for (const a of this.ash) {
            a.x    += a.vx * dt;
            a.y    += a.vy * dt;
            a.flick += dt * 3;
            if (a.y > this.h + 8) Object.assign(a, this._newAsh(false));
        }

        this._layout(this.screen);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DRAW — top level
    // ═══════════════════════════════════════════════════════════════════════

    draw(ctx) {
        if (!this.active) return;

        this._drawSky(ctx);
        this._drawSearchlights(ctx);
        this._drawHorizon(ctx);
        this._drawPaper(ctx);
        this._drawAsh(ctx);

        if (this.screen === 'main') {
            this._drawStars(ctx);          // classification stars top-corners
            this._drawTitle(ctx);
            this._drawTagline(ctx);
            this._drawDivider(ctx, this.h * 0.535);
            this._drawButtons(ctx, this.buttons.main);
            this._drawClassifiedStamp(ctx);
            this._drawFooter(ctx);
        } else {
            this._drawBriefing(ctx);
            this._drawButtons(ctx, this.buttons.help);
        }

        this._drawVignette(ctx);
        this._drawFilmBurn(ctx);
    }

    _drawSky(ctx) {
        // Deep wartime night sky — almost black with warm brown tint
        const g = ctx.createLinearGradient(0, 0, 0, this.h);
        g.addColorStop(0,   '#09080a');
        g.addColorStop(0.6, '#120e08');
        g.addColorStop(1,   '#1a120a');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.w, this.h);

        // Distant fire glow on horizon
        const fire = ctx.createRadialGradient(this.w * 0.5, this.h, 0, this.w * 0.5, this.h, this.w * 0.7);
        fire.addColorStop(0,   'rgba(180,60,10,0.18)');
        fire.addColorStop(0.5, 'rgba(120,30,5,0.08)');
        fire.addColorStop(1,   'transparent');
        ctx.fillStyle = fire;
        ctx.fillRect(0, 0, this.w, this.h);
    }

    _drawSearchlights(ctx) {
        ctx.save();
        for (const l of this.lights) {
            const bx = l.x;
            const by = this.h;
            const tx = bx + Math.sin(l.angle) * this.h * 1.6;
            const ty = -60;

            // Beam
            const beamW = 28;
            const grd = ctx.createLinearGradient(bx, by, tx, ty);
            grd.addColorStop(0,   'rgba(220,210,160,0.10)');
            grd.addColorStop(0.5, 'rgba(220,210,160,0.05)');
            grd.addColorStop(1,   'transparent');

            ctx.beginPath();
            const perpX = Math.cos(l.angle) * beamW;
            const perpY = Math.sin(l.angle) * beamW;
            ctx.moveTo(bx - perpX * 0.3, by);
            ctx.lineTo(bx + perpX * 0.3, by);
            ctx.lineTo(tx + perpX, ty);
            ctx.lineTo(tx - perpX, ty);
            ctx.closePath();
            ctx.fillStyle = grd;
            ctx.fill();

            // Bright centre line
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = 'rgba(240,230,180,0.12)';
            ctx.lineWidth   = 1.5;
            ctx.stroke();

            // Base lamp
            ctx.beginPath();
            ctx.arc(bx, by - 4, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(240,220,150,0.55)';
            ctx.fill();
        }
        ctx.restore();
    }

    _drawHorizon(ctx) {
        // Silhouetted city/airfield on horizon
        const hy = this.h * 0.78;
        ctx.save();
        ctx.fillStyle = '#0a0806';

        // Rough building silhouettes
        const buildings = [
            [0, 22], [40, 18], [70, 30], [110, 14], [150, 26],
            [200, 12], [240, 20], [280, 16], [320, 28], [370, 10],
            [410, 22], [450, 18], [490, 30], [530, 14], [570, 24],
            [610, 12], [650, 20], [700, 16], [740, 26], [780, 14],
        ];
        for (const [bx, bh] of buildings) {
            ctx.fillRect(bx, hy - bh, 28 + (bx % 14), bh + (this.h - hy));
        }

        // Ground fill
        ctx.fillRect(0, hy, this.w, this.h - hy);
        ctx.restore();

        // Glow above buildings
        const horizGlow = ctx.createLinearGradient(0, hy - 30, 0, hy + 10);
        horizGlow.addColorStop(0,   'transparent');
        horizGlow.addColorStop(0.5, 'rgba(160,50,5,0.12)');
        horizGlow.addColorStop(1,   'rgba(100,30,0,0.2)');
        ctx.fillStyle = horizGlow;
        ctx.fillRect(0, hy - 30, this.w, 40);
    }

    _drawPaper(ctx) {
        const pw = this._paper.width;
        const ph = this._paper.height;
        ctx.save();
        ctx.globalAlpha = 0.55;
        for (let x = 0; x < this.w; x += pw) {
            for (let y = 0; y < this.h; y += ph) {
                ctx.drawImage(this._paper, x, y);
            }
        }
        ctx.restore();
    }

    _drawAsh(ctx) {
        ctx.save();
        for (const a of this.ash) {
            const flicker = 0.7 + Math.sin(a.flick) * 0.3;
            ctx.fillStyle = `rgba(200,180,130,${a.alpha * flicker})`;
            ctx.fillRect(a.x | 0, a.y | 0, a.size, a.size);
        }
        ctx.restore();
    }
    _drawStars(ctx) {
        // A cool little classification stars top-left and top-right like a military doc
        ctx.save();
        ctx.font      = '11px "Courier New", monospace';
        ctx.fillStyle = 'rgba(180,50,30,0.75)';
        ctx.textBaseline = 'top';
        ctx.textAlign    = 'left';
        ctx.fillText('★ ★ ★  TOP SECRET  ★ ★ ★', 18, 14);
        ctx.restore();
    }

    _drawTitle(ctx) {
        const cx = this.w / 2;
        const barY = this.h * 0.16;
        const barH = 72;
        ctx.save();
        ctx.fillStyle = 'rgba(140,20,10,0.82)';
        ctx.fillRect(0, barY, this.w, barH);

        // Rivets on banner
        for (const rx of [14, this.w - 14]) {
            for (const ry of [barY + 12, barY + barH - 12]) {
                ctx.beginPath();
                ctx.arc(rx, ry, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(80,10,5,0.8)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(rx - 1, ry - 1, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200,150,120,0.5)';
                ctx.fill();
            }
        }

        // Thin rule lines top/bottom of banner
        ctx.strokeStyle = 'rgba(200,100,60,0.5)';
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.moveTo(0, barY);         ctx.lineTo(this.w, barY);         ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, barY + barH);  ctx.lineTo(this.w, barY + barH);  ctx.stroke();

        // Title text — stencil block capitals
        ctx.font         = 'bold 52px "Courier New", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(60,5,0,0.9)';
        ctx.fillText('WARHAWK', cx + 2, barY + barH / 2 + 2);

        ctx.fillStyle = '#f0e8cc';
        ctx.fillText('WARHAWK', cx, barY + barH / 2);

        ctx.restore();

        const sub = '1941  ·  AERIAL SUPREMACY  ·  1941';
        ctx.save();
        ctx.font         = '10px "Courier New", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = 'rgba(220,190,120,0.6)';
        ctx.fillText(sub, cx, barY + barH + 13);
        ctx.restore();
    }

    _drawTagline(ctx) {
        const cx = this.w / 2;
        const y  = this.h * 0.38;

        ctx.save();
        ctx.font         = 'bold 13px "Courier New", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = 'rgba(200,170,90,0.85)';
        ctx.fillText('— TORCH THE SKIES —', cx, y);
        ctx.restore();
    }

    _drawDivider(ctx, y) {
        const cx  = this.w / 2;
        const lw  = 280;

        ctx.save();

        // Main line
        const g = ctx.createLinearGradient(cx - lw/2, y, cx + lw/2, y);
        g.addColorStop(0,    'transparent');
        g.addColorStop(0.12, 'rgba(160,40,20,0.7)');
        g.addColorStop(0.88, 'rgba(160,40,20,0.7)');
        g.addColorStop(1,    'transparent');
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.moveTo(cx - lw/2, y); ctx.lineTo(cx + lw/2, y); ctx.stroke();

        // Centre diamond
        ctx.fillStyle = 'rgba(160,40,20,0.9)';
        ctx.save();
        ctx.translate(cx, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();

        ctx.restore();
    }

    _drawButtons(ctx, list) {
        const bx = this._btnX();
        const bw = this._btnW();
        const bh = this._btnH();

        list.forEach((b, i) => {
            const hov = this.hoveredBtn === b;
            const cx  = bx + bw / 2;
            const cy  = b.y + bh / 2;

            ctx.save();

            // Button background
            if (hov) {
                ctx.fillStyle = 'rgba(140,20,10,0.55)';
                ctx.fillRect(bx, b.y, bw, bh);
            }

            // Left accent stripe
            ctx.fillStyle = hov ? 'rgba(200,60,30,0.9)' : 'rgba(120,30,15,0.4)';
            ctx.fillRect(bx, b.y, 4, bh);

            // Right accent stripe
            ctx.fillStyle = hov ? 'rgba(200,60,30,0.9)' : 'rgba(120,30,15,0.4)';
            ctx.fillRect(bx + bw - 4, b.y, 4, bh);

            // Border
            ctx.strokeStyle = hov ? 'rgba(210,90,50,0.75)' : 'rgba(130,50,20,0.3)';
            ctx.lineWidth   = 1;
            ctx.strokeRect(bx + 0.5, b.y + 0.5, bw - 1, bh - 1);

            // Arrow on hover
            if (hov) {
                ctx.fillStyle    = '#e8a060';
                ctx.font         = '13px "Courier New", monospace';
                ctx.textAlign    = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText('►', bx - 8, cy);
            }

            // Index number — military order numbering
            ctx.font         = '9px "Courier New", monospace';
            ctx.textAlign    = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = hov ? 'rgba(230,160,80,0.7)' : 'rgba(150,100,50,0.35)';
            if (list.length > 1) ctx.fillText(`0${i + 1}`, bx + 10, cy);

            // Label
            ctx.font         = 'bold 15px "Courier New", monospace';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle    = hov ? '#f5e8c0' : 'rgba(200,175,115,0.7)';
            if (hov) { ctx.shadowColor = 'rgba(200,80,30,0.6)'; ctx.shadowBlur = 10; }
            ctx.fillText(b.label, cx + 6, cy);

            ctx.restore();
        });
    }

    _drawClassifiedStamp(ctx) {
        const cx = this.w / 2;
        const cy = this.h * 0.90;

        ctx.save();
        ctx.translate(cx + 90, cy - 10);
        ctx.rotate(-0.18);

        // Stamp border
        ctx.strokeStyle = 'rgba(160,30,20,0.35)';
        ctx.lineWidth   = 2;
        ctx.strokeRect(-48, -11, 96, 22);

        // Inner border
        ctx.strokeStyle = 'rgba(160,30,20,0.2)';
        ctx.lineWidth   = 1;
        ctx.strokeRect(-44, -8, 88, 16);

        // Stamp text
        ctx.font         = 'bold 11px "Courier New", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = 'rgba(160,30,20,0.4)';
        ctx.fillText('CLASSIFIED', 0, 0);

        ctx.restore();
    }

    _drawFooter(ctx) {
        if (!this.blinkOn) return;
        ctx.save();
        ctx.font         = '9px "Courier New", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle    = 'rgba(160,140,80,0.45)';
        ctx.fillText(
            'INSERT COIN  ·  AIR COMMAND HQ  ·  © 1943',
            this.w / 2, this.h - 8
        );
        ctx.restore();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DRAW — briefing screen
    // ═══════════════════════════════════════════════════════════════════════

    _drawBriefing(ctx) {
        const cx = this.w / 2;

        // Top red header bar
        ctx.save();
        ctx.fillStyle = 'rgba(130,18,10,0.78)';
        ctx.fillRect(cx - 210, this.h * 0.08, 420, 46);
        ctx.strokeStyle = 'rgba(180,60,30,0.4)';
        ctx.lineWidth   = 1;
        ctx.strokeRect(cx - 210 + 0.5, this.h * 0.08 + 0.5, 419, 45);

        ctx.font         = 'bold 16px "Courier New", monospace';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = '#f0e8cc';
        ctx.fillText('MISSION BRIEFING', cx, this.h * 0.08 + 23);
        ctx.restore();

        this._drawDivider(ctx, this.h * 0.192);

        const rows = [
            ['MANEUVER',   'ARROW KEYS / WASD'],
            ['OPEN FIRE',  'SPACE'],
            ['MISSILE',    'm'],
            ['PAUSE',      'ESC'],
            ['POWER-UP',   'FLY OVER ITEM'],
        ];

        ctx.save();
        const rowH   = 36;
        const startY = this.h * 0.24;

        rows.forEach(([key, val], i) => {
            const y = startY + i * rowH;

            // Row band
            if (i % 2 === 0) {
                ctx.fillStyle = 'rgba(140,20,10,0.07)';
                ctx.fillRect(cx - 200, y - rowH / 2 + 4, 400, rowH - 8);
            }

            ctx.strokeStyle = 'rgba(130,50,20,0.15)';
            ctx.lineWidth   = 1;
            ctx.strokeRect(cx - 200 + 0.5, y - rowH / 2 + 4.5, 399, rowH - 9);

            ctx.font      = '11px "Courier New", monospace';
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(180,50,30,0.7)';
            ctx.fillText('►', cx - 192, y + 2);

            // Key label
            ctx.textAlign = 'right';
            ctx.fillStyle = 'rgba(200,170,90,0.75)';
            ctx.font      = 'bold 12px "Courier New", monospace';
            ctx.fillText(key, cx - 12, y + 2);

            // Value
            ctx.textAlign = 'left';
            ctx.fillStyle = 'rgba(230,215,170,0.9)';
            ctx.font      = '12px "Courier New", monospace';
            ctx.fillText(val, cx + 20, y + 2);
        });

        // Objective text
        ctx.font      = '10px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(160,130,70,0.5)';
        ctx.fillText(
            'OBJECTIVE: DESTROY ALL ENEMY FORCES. DO NOT FAIL.',
            cx, this.h * 0.685
        );

        ctx.restore();
    }


    _drawVignette(ctx) {
        const g = ctx.createRadialGradient(
            this.w / 2, this.h / 2, this.h * 0.2,
            this.w / 2, this.h / 2, this.h * 0.95
        );
        g.addColorStop(0,   'transparent');
        g.addColorStop(0.7, 'rgba(0,0,0,0.25)');
        g.addColorStop(1,   'rgba(0,0,0,0.75)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.w, this.h);
    }

    _drawFilmBurn(ctx) {

        const top = ctx.createLinearGradient(0, 0, 0, 18);
        top.addColorStop(0, 'rgba(0,0,0,0.7)');
        top.addColorStop(1, 'transparent');
        ctx.fillStyle = top;
        ctx.fillRect(0, 0, this.w, 18);
        const bot = ctx.createLinearGradient(0, this.h - 18, 0, this.h);
        bot.addColorStop(0, 'transparent');
        bot.addColorStop(1, 'rgba(0,0,0,0.7)');
        ctx.fillStyle = bot;
        ctx.fillRect(0, this.h - 18, this.w, 18);

        if (Math.random() < 0.04) {
            const sy = Math.random() * this.h;
            ctx.fillStyle = 'rgba(255,240,200,0.04)';
            ctx.fillRect(0, sy, this.w, 1);
        }
    }
}