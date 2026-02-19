'use client';

import { useEffect, useRef, useState } from 'react';
import { uniTalentColors } from 'src/common/Colors';
import { useInView } from 'src/hooks/useInView';

/* -------------------- Animation Canvas -------------------- */

const W = 900;
const H = 600;
const FILTER_Y = 310;
const FILTER_THICKNESS = 3;
const BALL_R = 9;
const HALF = W / 2;
const COL = {
  bg: "#06060e",
  merit: "#00e5aa",
  inflator: "#ff3d5a",
  filterATS: "#ff3d5a",
  filterUnit: "#7c6fff",
  muted: "#44465a",
  divider: "#1a1a2e",
};

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

function makeBall(side: number) {
  const type = Math.random() < 0.5 ? "merit" : "inflator";
  return {
    x: side === 0 ? rand(50, HALF - 50) : rand(HALF + 50, W - 50),
    y: rand(-100, -10),
    vx: rand(-0.5, 0.5),
    vy: rand(0.9, 1.6),
    r: BALL_R,
    type,
    side,
    phase: "falling",
    opacity: 1,
    glowPulse: rand(0, Math.PI * 2),
    trail: [] as { x: number; y: number }[],
    flashTimer: 0,
  };
}

function shouldPass(ball: ReturnType<typeof makeBall>) {
  return ball.side === 0 ? ball.type === "inflator" : ball.type === "merit";
}

const AnimationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ balls: [] as ReturnType<typeof makeBall>[], t: 0, spawnTimer: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;
    let raf: number;

    for (let i = 0; i < 5; i++) {
      stateRef.current.balls.push(makeBall(0));
      stateRef.current.balls.push(makeBall(1));
    }

    const ripples: { x: number; y: number; color: string; r: number; alpha: number; big: boolean }[] = [];
    function addRipple(x: number, y: number, color: string, big = false) {
      ripples.push({ x, y, color, r: 2, alpha: 1, big });
    }

    function drawBall(ctx: CanvasRenderingContext2D, ball: ReturnType<typeof makeBall>) {
      if (ball.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = ball.opacity;
      const color = ball.type === "merit" ? COL.merit : COL.inflator;
      const glowColor = ball.type === "merit" ? "rgba(0,229,170" : "rgba(255,61,90";
      const label = ball.type === "merit" ? "Merit" : "Inflator";

      ball.trail.forEach((pt, i) => {
        const a = (i / ball.trail.length) * 0.14 * ball.opacity;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, ball.r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      const flashBoost = ball.flashTimer > 0 ? (ball.flashTimer / 20) * 0.45 : 0;
      const pulse = 0.16 + 0.07 * Math.sin(ball.glowPulse) + flashBoost;
      const glow = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.r * 5);
      glow.addColorStop(0, `${glowColor},${pulse})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r * 5, 0, Math.PI * 2);
      ctx.fill();

      const grad = ctx.createRadialGradient(ball.x - ball.r * 0.3, ball.y - ball.r * 0.35, 0, ball.x, ball.y, ball.r);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, color);
      grad.addColorStop(1, color + "88");
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur = ball.flashTimer > 0 ? 20 : 7;
      ctx.fill();

      const scale = ball.flashTimer > 0 ? 1 + (ball.flashTimer / 20) * 0.6 : 1;
      const fontSize = Math.round(7.5 * scale);
      ctx.shadowBlur = 0;
      ctx.font = `700 ${fontSize}px system-ui`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const tw = ctx.measureText(label).width;
      const pw = tw + 7, ph = fontSize + 4;
      const lx = ball.x - pw / 2;
      const ly = ball.y - ball.r - ph - 3;
      ctx.fillStyle = "rgba(6,6,14,0.8)";
      ctx.beginPath();
      ctx.roundRect(lx, ly, pw, ph, 3);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.globalAlpha = ball.opacity * (0.65 + 0.35 * scale);
      ctx.fillText(label, ball.x, ly + ph / 2);
      ctx.restore();
    }

    function drawFilterLine(ctx: CanvasRenderingContext2D, side: number, t: number) {
      const x0 = side === 0 ? 20 : HALF + 10;
      const x1 = side === 0 ? HALF - 10 : W - 20;
      const color = side === 0 ? COL.filterATS : COL.filterUnit;

      const glowG = ctx.createLinearGradient(x0, 0, x1, 0);
      glowG.addColorStop(0, "transparent");
      glowG.addColorStop(0.5, color + "44");
      glowG.addColorStop(1, "transparent");
      ctx.fillStyle = glowG;
      ctx.fillRect(x0, FILTER_Y - 6, x1 - x0, 12);

      const shimmer = 0.65 + 0.35 * Math.sin(t * 0.035 + side * Math.PI);
      ctx.save();
      ctx.globalAlpha = shimmer;
      const lineG = ctx.createLinearGradient(x0, 0, x1, 0);
      lineG.addColorStop(0, "transparent");
      lineG.addColorStop(0.15, color);
      lineG.addColorStop(0.85, color);
      lineG.addColorStop(1, "transparent");
      ctx.strokeStyle = lineG;
      ctx.lineWidth = FILTER_THICKNESS;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x0, FILTER_Y);
      ctx.lineTo(x1, FILTER_Y);
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < 3; i++) {
        const prog = ((t * 0.8 + i * 80 + side * 40) % 240) / 240;
        const px = x0 + prog * (x1 - x0);
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(px, FILTER_Y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.restore();
      }
    }

    function drawLabels(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "800 15px system-ui";
      ctx.fillStyle = COL.filterATS + "dd";
      ctx.fillText("KEYWORD BASED SYSTEM", HALF / 2, 28);
      ctx.font = "600 12px system-ui";
      ctx.fillStyle = COL.filterATS + "77";
      ctx.fillText("BY ATS", HALF / 2, 46);
      ctx.font = "800 15px system-ui";
      ctx.fillStyle = COL.filterUnit + "dd";
      ctx.fillText("MERIT BASED SYSTEM", HALF + HALF / 2, 28);
      ctx.font = "600 12px system-ui";
      ctx.fillStyle = COL.filterUnit + "77";
      ctx.fillText("BY UNITALENT", HALF + HALF / 2, 46);
      ctx.font = "600 11px system-ui";
      ctx.fillStyle = COL.filterATS + "88";
      ctx.textAlign = "left";
      ctx.fillText("KEYWORD FILTER", 24, FILTER_Y - 14);
      ctx.fillStyle = COL.filterUnit + "88";
      ctx.textAlign = "right";
      ctx.fillText("TALENT FILTER", W - 24, FILTER_Y - 14);
      ctx.font = "700 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillStyle = COL.inflator + "88";
      ctx.fillText("✓ RESUME INFLATORS HIRED", HALF / 2, H - 26);
      ctx.fillStyle = COL.merit + "44";
      ctx.fillText("✗ MERIT BLOCKED", HALF / 2, H - 10);
      ctx.fillStyle = COL.merit + "88";
      ctx.fillText("✓ MERIT HIRED", HALF + HALF / 2, H - 26);
      ctx.fillStyle = COL.inflator + "44";
      ctx.fillText("✗ RESUME INFLATORS BLOCKED", HALF + HALF / 2, H - 10);
      ctx.restore();
    }

    function drawLegend(ctx: CanvasRenderingContext2D) {
      const items = [
        { color: COL.merit, label: "Genuine merit candidate" },
        { color: COL.inflator, label: "Resume inflator" },
      ];
      const startX = W / 2 - 155;
      items.forEach((item, i) => {
        const x = startX + i * 195;
        const y = FILTER_Y + 22;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
        ctx.font = "500 11px system-ui";
        ctx.fillStyle = COL.muted;
        ctx.textAlign = "left";
        ctx.fillText(item.label, x + 10, y + 4);
      });
    }

    function drawDivider(ctx: CanvasRenderingContext2D) {
      const grad = ctx.createLinearGradient(HALF, 0, HALF, H);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.25, COL.divider);
      grad.addColorStop(0.75, COL.divider);
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(HALF, 0);
      ctx.lineTo(HALF, H);
      ctx.stroke();
    }

    function drawBackground(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = COL.bg;
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.globalAlpha = 0.025;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();
      const p1 = ctx.createRadialGradient(HALF / 2, H * 0.65, 0, HALF / 2, H * 0.65, 220);
      p1.addColorStop(0, "rgba(255,61,90,0.05)"); p1.addColorStop(1, "transparent");
      ctx.fillStyle = p1; ctx.fillRect(0, 0, HALF, H);
      const p2 = ctx.createRadialGradient(HALF + HALF / 2, H * 0.65, 0, HALF + HALF / 2, H * 0.65, 220);
      p2.addColorStop(0, "rgba(0,229,170,0.04)"); p2.addColorStop(1, "transparent");
      ctx.fillStyle = p2; ctx.fillRect(HALF, 0, HALF, H);
    }

    function updateRipples(ctx: CanvasRenderingContext2D) {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += rip.big ? 2.8 : 1.4;
        rip.alpha -= rip.big ? 0.022 : 0.038;
        if (rip.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = rip.alpha;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color;
        ctx.lineWidth = rip.big ? 2 : 1.2;
        ctx.stroke();
        ctx.restore();
      }
    }

    function loop() {
      const s = stateRef.current;
      s.t++;
      s.spawnTimer++;

      if (s.spawnTimer > 50) {
        s.spawnTimer = 0;
        if (s.balls.filter(b => b.phase === "falling" && b.side === 0).length < 5)
          s.balls.push(makeBall(0));
        if (s.balls.filter(b => b.phase === "falling" && b.side === 1).length < 5)
          s.balls.push(makeBall(1));
      }

      s.balls.forEach(ball => {
        ball.glowPulse += 0.06;
        if (ball.flashTimer > 0) ball.flashTimer = Math.max(0, ball.flashTimer - 1);

        const leftBound  = ball.side === 0 ? BALL_R + 14 : HALF + BALL_R + 14;
        const rightBound = ball.side === 0 ? HALF - BALL_R - 14 : W - BALL_R - 14;

        if (ball.phase === "falling" || ball.phase === "passed") {
          ball.trail.push({ x: ball.x, y: ball.y });
          if (ball.trail.length > 8) ball.trail.shift();
          ball.x += ball.vx;
          ball.y += ball.vy;
          ball.vy += 0.035;
          if (ball.x < leftBound)  { ball.x = leftBound;  ball.vx =  Math.abs(ball.vx); }
          if (ball.x > rightBound) { ball.x = rightBound; ball.vx = -Math.abs(ball.vx); }

          if (ball.phase === "falling" && ball.y + ball.r >= FILTER_Y && ball.y - ball.r < FILTER_Y + 12) {
            const color = ball.type === "merit" ? COL.merit : COL.inflator;
            addRipple(ball.x, FILTER_Y, color, true);
            addRipple(ball.x, FILTER_Y, color, false);
            ball.flashTimer = 20;
            if (shouldPass(ball)) { ball.phase = "passed"; }
            else { ball.phase = "blocked"; ball.vy = -ball.vy * 0.55; ball.vx += rand(-0.3, 0.3); }
          }

          if (ball.phase === "passed" && ball.y > H + 20) ball.phase = "fading";
        }

        if (ball.phase === "blocked") {
          ball.trail.push({ x: ball.x, y: ball.y });
          if (ball.trail.length > 5) ball.trail.shift();
          ball.x += ball.vx;
          ball.y += ball.vy;
          ball.vy += 0.04;
          if (ball.y + ball.r > FILTER_Y) { ball.y = FILTER_Y - ball.r; ball.vy = -Math.abs(ball.vy) * 0.45; }
          if (ball.x < leftBound)  { ball.x = leftBound;  ball.vx =  Math.abs(ball.vx); }
          if (ball.x > rightBound) { ball.x = rightBound; ball.vx = -Math.abs(ball.vx); }
          ball.opacity -= 0.007;
          if (ball.opacity <= 0) ball.phase = "fading";
        }
      });

      s.balls = s.balls.filter(b => b.phase !== "fading");

      drawBackground(ctx);
      drawDivider(ctx);
      drawLabels(ctx);
      drawFilterLine(ctx, 0, s.t);
      drawFilterLine(ctx, 1, s.t);
      drawLegend(ctx);
      updateRipples(ctx);
      s.balls.forEach(b => drawBall(ctx, b));

      raf = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

/* -------------------- Hero Section -------------------- */

const HeroSection = () => {
  const { ref, isInView } = useInView();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-[1500ms] ${
        isInView ? 'animate-in' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimationCanvas />

        {/* Dark overlay for content readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              rgba(6,6,14,0.55) 0%,
              rgba(6,6,14,0.45) 50%,
              rgba(6,6,14,0.55) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: uniTalentColors.primary,
                animation: `float-particle ${Math.random() * 10 + 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="w-full max-w-4xl mx-auto text-center">

          {/* Main Tagline */}
          <div className="mb-6 sm:mb-8 lg:mb-10 animate-fade-in-up">
            <h1
              style={{ color: '#FFFFFF' }}
              className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 lg:mb-8"
            >
              Reimagining Talent Discovery
            </h1>
          </div>

          {/* Subtitle */}
          <p
            style={{ color: 'rgba(255, 255, 255, 0.85)', animationDelay: '0.2s' }}
            className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 leading-relaxed animate-fade-in-up"
          >
            Be part of a new talent ecosystem
          </p>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        style={{ color: uniTalentColors.white }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(var(--tx, 20px), var(--ty, -30px)); opacity: 0.3; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        @media (max-width: 640px) {
          h1 { line-height: 1.1; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;