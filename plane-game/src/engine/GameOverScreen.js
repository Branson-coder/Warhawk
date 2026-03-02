export default class GameOverScreen {
    constructor(canvas, ctx, game, finalScore) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game;
        this.w = canvas.width;
        this.h = canvas.height;
        this.finalScore = finalScore;

        this.active = true;
        this.time = 0;

        // Fade in
        this.fadeAlpha = 0;
        this.fadeDuration = 1.2;

        // Text reveal stagger
        this.textDelay = 0.8;

        // Button
        this.button = {
            label: 'RETURN TO BASE',
            action: 'menu',
            y: this.h * 0.72,
            hovered: false
        };

        // Falling debris
        this.debris = Array.from({ length: 40 }, () => this._newDebris(true));

        // Input
        this._onMove = this._onMove.bind(this);
        this._onClick = this._onClick.bind(this);
        canvas.addEventListener('mousemove', this._onMove);
        canvas.addEventListener('click', this._onClick);
    }

    _newDebris(scatter = false) {
        return {
            x: Math.random() * this.w,
            y: scatter ? Math.random() * this.h : -6,
            vx: (Math.random() - 0.5) * 20,
            vy: 30 + Math.random() * 60,
            size: 1 + Math.random() * 2.5,
            alpha: 0.15 + Math.random() * 0.35,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 3,
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BUTTON LAYOUT
    // ═══════════════════════════════════════════════════════════════════════

    _btnW() { return 240; }
    _btnH() { return 44; }
    _btnX() { return (this.w - this._btnW()) / 2; }

    _hit(mx, my) {
        const bx = this._btnX();
        const b = this.button;
        return mx >= bx && mx <= bx + this._btnW() &&
               my >= b.y && my <= b.y + this._btnH();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INPUT
    // ═══════════════════════════════════════════════════════════════════════

    _onMove(e) {
        if (!this.active) return;
        const r = this.canvas.getBoundingClientRect();
        const mx = (e.clientX - r.left) * (this.w / r.width);
        const my = (e.clientY - r.top) * (this.h / r.height);
        this.button.hovered = this._hit(mx, my);
        this.canvas.style.cursor = this.button.hovered ? 'pointer' : 'default';
    }

    _onClick(e) {
        if (!this.active) return;
        const r = this.canvas.getBoundingClientRect();
        const mx = (e.clientX - r.left) * (this.w / r.width);
        const my = (e.clientY - r.top) * (this.h / r.height);
        if (this._hit(mx, my)) {
            this.destroy();
            // Reset game and return to menu
            window.location.reload();
        }
    }

    destroy() {
        this.active = false;
        this.canvas.removeEventListener('mousemove', this._onMove);
        this.canvas.removeEventListener('click', this._onClick);
        this.canvas.style.cursor = 'default';
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UPDATE
    // ═══════════════════════════════════════════════════════════════════════

    update(dt) {
        if (!this.active) return;
        this.time += dt;

        // Fade in
        this.fadeAlpha = Math.min(this.fadeAlpha + dt / this.fadeDuration, 1);

        // Debris
        for (const d of this.debris) {
            d.x += d.vx * dt;
            d.y += d.vy * dt;
            d.rotation += d.rotSpeed * dt;
            if (d.y > this.h + 8) Object.assign(d, this._newDebris(false));
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DRAW
    // ═══════════════════════════════════════════════════════════════════════

    draw(ctx) {
        if (!this.active) return;

        this._drawOverlay(ctx);
        this._drawDebris(ctx);

        if (this.time > this.textDelay * 0.3) this._drawGameOver(ctx);
        if (this.time > this.textDelay * 0.7) this._drawMissionStatus(ctx);
        if (this.time > this.textDelay * 1.0) this._drawScore(ctx);
        if (this.time > this.textDelay * 1.3) this._drawButton(ctx);

        this._drawVignette(ctx);
    }

    _drawOverlay(ctx) {
        // Dark red fade-in
        ctx.save();
        ctx.fillStyle = `rgba(18,8,6,${this.fadeAlpha * 0.85})`;
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();

        // Diagonal burn lines
        ctx.save();
        ctx.strokeStyle = `rgba(140,30,20,${this.fadeAlpha * 0.15})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const x = (this.w / 8) * i + Math.sin(this.time + i) * 20;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 100, this.h);
            ctx.stroke();
        }
        ctx.restore();
    }

    _drawDebris(ctx) {
        ctx.save();
        for (const d of this.debris) {
            ctx.save();
            ctx.translate(d.x, d.y);
            ctx.rotate(d.rotation);
            ctx.fillStyle = `rgba(180,140,80,${d.alpha * this.fadeAlpha})`;
            ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size);
            ctx.restore();
        }
        ctx.restore();
    }

    _drawGameOver(ctx) {
        const cx = this.w / 2;
        const cy = this.h * 0.28;

        // Red alert banner
        ctx.save();
        ctx.fillStyle = 'rgba(160,20,10,0.75)';
        ctx.fillRect(0, cy - 32, this.w, 64);
        ctx.strokeStyle = 'rgba(200,60,30,0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, cy - 32, this.w, 64);
        ctx.strokeRect(0, cy - 31, this.w, 62);
        ctx.restore();

        // "MISSION FAILED"
        ctx.save();
        ctx.font = 'bold 42px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillText('MISSION FAILED', cx + 3, cy + 3);

        // Main text
        ctx.fillStyle = '#f0e8cc';
        ctx.shadowColor = 'rgba(200,80,30,0.6)';
        ctx.shadowBlur = 16;
        ctx.fillText('MISSION FAILED', cx, cy);
        ctx.restore();
    }

    _drawMissionStatus(ctx) {
        const cx = this.w / 2;
        const cy = this.h * 0.42;

        ctx.save();
        ctx.font = '12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(200,160,100,0.75)';
        ctx.fillText('AIRCRAFT DESTROYED  —  PILOT K.I.A.', cx, cy);
        ctx.restore();

        // Divider line
        const lw = 260;
        const ly = cy + 18;
        const grad = ctx.createLinearGradient(cx - lw / 2, ly, cx + lw / 2, ly);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.2, 'rgba(160,40,20,0.6)');
        grad.addColorStop(0.8, 'rgba(160,40,20,0.6)');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - lw / 2, ly);
        ctx.lineTo(cx + lw / 2, ly);
        ctx.stroke();
    }

    _drawScore(ctx) {
        const cx = this.w / 2;
        const cy = this.h * 0.54;

        // Score panel
        ctx.save();
        ctx.fillStyle = 'rgba(40,35,25,0.8)';
        ctx.fillRect(cx - 140, cy - 28, 280, 56);
        ctx.strokeStyle = 'rgba(120,100,60,0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 140 + 0.5, cy - 28 + 0.5, 279, 55);
        ctx.restore();

        // "FINAL SCORE" label
        ctx.save();
        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(200,160,80,0.65)';
        ctx.fillText('FINAL SCORE', cx, cy - 18);
        ctx.restore();

        // Score value
        ctx.save();
        ctx.font = 'bold 32px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#e8d8a0';
        ctx.shadowColor = 'rgba(200,160,80,0.5)';
        ctx.shadowBlur = 12;
        ctx.fillText(this.finalScore.toString().padStart(6, '0'), cx, cy + 8);
        ctx.restore();
    }

    _drawButton(ctx) {
        const bx = this._btnX();
        const b = this.button;
        const cx = bx + this._btnW() / 2;
        const cy = b.y + this._btnH() / 2;

        ctx.save();

        if (b.hovered) {
            // Highlight background
            ctx.fillStyle = 'rgba(140,20,10,0.6)';
            ctx.fillRect(bx, b.y, this._btnW(), this._btnH());

            // Left accent
            ctx.fillStyle = 'rgba(200,60,30,0.9)';
            ctx.fillRect(bx, b.y, 4, this._btnH());

            // Right accent
            ctx.fillRect(bx + this._btnW() - 4, b.y, 4, this._btnH());

            // Border
            ctx.strokeStyle = 'rgba(210,90,50,0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx + 0.5, b.y + 0.5, this._btnW() - 1, this._btnH() - 1);

            // Arrow
            ctx.fillStyle = '#e8a060';
            ctx.font = '14px "Courier New", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText('►', bx - 10, cy);
        } else {
            // Dim border
            ctx.strokeStyle = 'rgba(130,50,20,0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx + 0.5, b.y + 0.5, this._btnW() - 1, this._btnH() - 1);

            // Left/right accents dim
            ctx.fillStyle = 'rgba(120,30,15,0.3)';
            ctx.fillRect(bx, b.y, 4, this._btnH());
            ctx.fillRect(bx + this._btnW() - 4, b.y, 4, this._btnH());
        }

        // Label
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = b.hovered ? '#f5e8c0' : 'rgba(200,175,115,0.7)';
        if (b.hovered) {
            ctx.shadowColor = 'rgba(200,80,30,0.7)';
            ctx.shadowBlur = 12;
        }
        ctx.fillText(b.label, cx, cy);

        ctx.restore();
    }

    _drawVignette(ctx) {
        const vg = ctx.createRadialGradient(
            this.w / 2, this.h / 2, this.h * 0.2,
            this.w / 2, this.h / 2, this.h * 0.9
        );
        vg.addColorStop(0, 'transparent');
        vg.addColorStop(1, 'rgba(0,0,0,0.75)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, this.w, this.h);
    }
}