// Visual Canvas and Sensor Simulations for Haunted & Hunted modes
class ParanormalScanner {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mode = 'haunted'; // 'haunted' or 'hunted'
        this.animId = null;
        this.blobs = [];
        this.radarAngle = 0;
        this.radarBlips = [];
        this.emfValue = 1.2;
        this.targetEMF = 1.2;
        this.emfPeak = 1.2;

        this.initBlobs();
        this.initRadarBlips();
    }

    init(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.startRenderLoop();
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * (window.devicePixelRatio || 1);
        this.canvas.height = rect.height * (window.devicePixelRatio || 1);
        if (this.ctx) {
            this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        }
    }

    setMode(mode) {
        this.mode = mode;
        if (mode === 'hunted') {
            this.initRadarBlips();
        } else {
            this.initBlobs();
        }
    }

    initBlobs() {
        this.blobs = [
            { x: 0.3, y: 0.4, vx: 0.003, vy: 0.002, r: 80, pulse: 0, color: 'rgba(0, 255, 157, 0.45)' },
            { x: 0.7, y: 0.6, vx: -0.002, vy: 0.003, r: 110, pulse: 2, color: 'rgba(168, 85, 247, 0.4)' },
            { x: 0.5, y: 0.3, vx: 0.004, vy: -0.002, r: 65, pulse: 4, color: 'rgba(56, 189, 248, 0.35)' },
            { x: 0.6, y: 0.7, vx: -0.003, vy: -0.003, r: 90, pulse: 1, color: 'rgba(236, 72, 153, 0.3)' }
        ];
    }

    initRadarBlips() {
        this.radarBlips = [
            { angle: 0.8, dist: 0.65, label: 'APEX_PREDATOR_01', type: 'hostile', alpha: 0.9, pulse: 0 },
            { angle: 2.3, dist: 0.42, label: 'DRONE_HUNTER_X', type: 'scanning', alpha: 0.8, pulse: 1.5 },
            { angle: 4.1, dist: 0.82, label: 'ROGUE_CRYPTO_BOT', type: 'tracking', alpha: 0.7, pulse: 3.2 },
            { angle: 5.4, dist: 0.30, label: 'THERMAL_SNIPER', type: 'locked', alpha: 1.0, pulse: 0.7 }
        ];
    }

    startRenderLoop() {
        const render = () => {
            if (this.ctx && this.canvas) {
                const w = this.canvas.clientWidth;
                const h = this.canvas.clientHeight;

                this.ctx.clearRect(0, 0, w, h);

                if (this.mode === 'haunted') {
                    this.renderEctoplasm(w, h);
                } else {
                    this.renderRadar(w, h);
                }

                this.updateEMFPhysics();
            }
            this.animId = requestAnimationFrame(render);
        };
        this.animId = requestAnimationFrame(render);
    }

    renderEctoplasm(w, h) {
        const ctx = this.ctx;
        ctx.save();

        // Dark thermal grid background
        ctx.fillStyle = '#06080e';
        ctx.fillRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 32;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Draw and update ectoplasm blobs with radial gradients
        ctx.globalCompositeOperation = 'screen';
        const now = Date.now() * 0.002;

        this.blobs.forEach((b) => {
            b.x += b.vx;
            b.y += b.vy;
            if (b.x < 0.1 || b.x > 0.9) b.vx *= -1;
            if (b.y < 0.1 || b.y > 0.9) b.vy *= -1;

            const cx = b.x * w;
            const cy = b.y * h;
            const radius = b.r + Math.sin(now + b.pulse) * 18;

            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
            grad.addColorStop(0, b.color);
            grad.addColorStop(0.5, b.color.replace(/[\d\.]+\)$/, '0.2)'));
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Cold spot marker
        ctx.globalCompositeOperation = 'source-over';
        const primaryBlob = this.blobs[0];
        const px = primaryBlob.x * w;
        const py = primaryBlob.y * h;

        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(px, py, 35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshairs on coldest spot
        ctx.beginPath();
        ctx.moveTo(px - 12, py);
        ctx.lineTo(px + 12, py);
        ctx.moveTo(px, py - 12);
        ctx.lineTo(px, py + 12);
        ctx.stroke();

        ctx.fillStyle = '#00ff9d';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`COLD SPOT: -4.2°C [ECTO DENSITY 92%]`, px + 18, py - 15);

        ctx.restore();
    }

    renderRadar(w, h) {
        const ctx = this.ctx;
        ctx.save();

        // Dark tactical background
        ctx.fillStyle = '#080505';
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) * 0.44;

        // Concentric radar range circles
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 1.2;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, (maxR / 4) * i, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Crosshair axes
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();

        // Radar beam rotation
        this.radarAngle = (this.radarAngle + 0.035) % (Math.PI * 2);

        // Sweep cone gradient
        const sweepGrad = ctx.createConicGradient(this.radarAngle - Math.PI / 2, cx, cy);
        sweepGrad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
        sweepGrad.addColorStop(0.12, 'rgba(239, 68, 68, 0.0)');
        sweepGrad.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();

        // Sweep leading line
        const lx = cx + Math.cos(this.radarAngle) * maxR;
        const ly = cy + Math.sin(this.radarAngle) * maxR;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(lx, ly);
        ctx.stroke();

        // Target Blips
        const now = Date.now() * 0.003;
        this.radarBlips.forEach(b => {
            const bx = cx + Math.cos(b.angle) * (b.dist * maxR);
            const by = cy + Math.sin(b.angle) * (b.dist * maxR);

            // Check if sweep recently passed over
            const angleDiff = Math.abs(this.radarAngle - b.angle);
            const isHighlighted = angleDiff < 0.2 || (Math.PI * 2 - angleDiff) < 0.2;

            ctx.fillStyle = isHighlighted ? '#ffffff' : '#ef4444';
            ctx.beginPath();
            ctx.arc(bx, by, isHighlighted ? 5 : 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Blip ring ping
            ctx.strokeStyle = isHighlighted ? '#ffffff' : 'rgba(239, 68, 68, 0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(bx, by, 7 + Math.sin(now + b.pulse) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // Label
            ctx.fillStyle = isHighlighted ? '#ffffff' : '#f87171';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillText(`${b.label} [${(b.dist * 100).toFixed(0)}m]`, bx + 9, by + 4);
        });

        // Center position indicator (You)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('YOU (PREY TARGET)', cx + 8, cy - 8);

        ctx.restore();
    }

    setTargetEMF(val) {
        this.targetEMF = val;
        if (val > this.emfPeak) {
            this.emfPeak = val;
        }
    }

    updateEMFPhysics() {
        // Jitter simulation
        const jitter = (Math.random() - 0.5) * 0.25;
        this.emfValue += (this.targetEMF + jitter - this.emfValue) * 0.1;
        this.emfValue = Math.max(0.2, Math.min(10.0, this.emfValue));

        // Update needle UI element if exists
        const needle = document.getElementById('emfNeedle');
        const readVal = document.getElementById('emfValueText');
        const peakVal = document.getElementById('emfPeakText');

        if (needle) {
            // map 0.0 - 10.0 mG to -65deg to +65deg
            const deg = -65 + (this.emfValue / 10.0) * 130;
            needle.style.transform = `rotate(${deg}deg)`;
        }
        if (readVal) {
            readVal.textContent = `${this.emfValue.toFixed(2)} mG`;
        }
        if (peakVal) {
            peakVal.textContent = `${this.emfPeak.toFixed(2)} mG`;
        }

        // Color intensity based on EMF
        const statusBox = document.getElementById('emfStatus');
        if (statusBox) {
            if (this.emfValue > 7.0) {
                statusBox.textContent = 'DANGER: EXTREME POLTERGEIST / PREDATOR SURGE';
                statusBox.className = 'emf-badge badge-danger';
            } else if (this.emfValue > 3.5) {
                statusBox.textContent = 'ALERT: ANOMALOUS SPECTRAL FIELD DETECTED';
                statusBox.className = 'emf-badge badge-warning';
            } else {
                statusBox.textContent = 'STATUS: NORMAL AMBIENT FLUX';
                statusBox.className = 'emf-badge badge-normal';
            }
        }
    }
}

window.paranormalScanner = new ParanormalScanner();
