/**
 * High-performance lightweight Canvas Confetti Engine
 * Custom tailored for Derby2party palette: Or (#F2B134), Vert (#0B3D2E), Rouge (#D6402B), Blanc (#FAF6EE)
 */

class ConfettiEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  burst(options = {}) {
    if (this.prefersReducedMotion) return;

    const count = options.count || 70;
    const originX = options.x !== undefined ? options.x : window.innerWidth / 2;
    const originY = options.y !== undefined ? options.y : window.innerHeight / 3;
    const colors = options.colors || ['#F2B134', '#0B3D2E', '#D6402B', '#FAF6EE', '#E3A824'];

    for (let i = 0; i < count; i++) {
      const angle = (options.angle !== undefined ? options.angle : -90) + (Math.random() - 0.5) * (options.spread || 110);
      const rad = (angle * Math.PI) / 180;
      const velocity = (options.velocity || 32) * (0.6 + Math.random() * 0.8);

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(rad) * velocity,
        vy: Math.sin(rad) * velocity,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.1 + Math.random() * 0.1,
        gravity: 0.45 + Math.random() * 0.2,
        drag: 0.94 + Math.random() * 0.03,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        decay: 0.008 + Math.random() * 0.008
      });
    }

    if (!this.animationFrame) {
      this.loop();
    }
  }

  rain(durationMs = 2800) {
    if (this.prefersReducedMotion) return;
    const endTime = Date.now() + durationMs;
    const interval = setInterval(() => {
      if (Date.now() > endTime) {
        clearInterval(interval);
        return;
      }
      this.burst({
        x: Math.random() * window.innerWidth,
        y: -10,
        angle: 90,
        spread: 60,
        velocity: 14,
        count: 15
      });
    }, 180);
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.scale(Math.cos(p.wobble), 1);
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.loop());
    } else {
      this.animationFrame = null;
    }
  }
}

window.confetti = new ConfettiEngine();
export default window.confetti;
