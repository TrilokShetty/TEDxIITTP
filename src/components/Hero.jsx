import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-white.png";
import Timer from "./Timer";

import "./Hero.css";

/* ─── Ticket button — full border + ornamental corners ───────────────────── */
const TicketButton = ({ onClick }) => {
  const [hov, setHov] = useState(false);

  const OrnCorner = ({ rotate }) => (
    <svg
      width="14" height="14"
      viewBox="0 0 14 14"
      style={{
        position: "absolute",
        display: "block",
        transition: "opacity 0.3s",
        opacity: hov ? 1 : 0.65,
        ...(rotate === 0 && { top: -6, left: -6 }),
        ...(rotate === 90 && { top: -6, right: -6 }),
        ...(rotate === 180 && { bottom: -6, right: -6 }),
        ...(rotate === 270 && { bottom: -6, left: -6 }),
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <line x1="7" y1="7" x2="14" y2="7"
        stroke={hov ? "var(--gold)" : "var(--gold)"} strokeWidth="1" />
      <line x1="7" y1="7" x2="7" y2="14"
        stroke={hov ? "var(--gold)" : "var(--gold)"} strokeWidth="1" />
      <rect x="5" y="5" width="4" height="4"
        transform="rotate(45 7 7)"
        fill={hov ? "var(--gold)" : "var(--gold)"}
        stroke="none"
      />
    </svg>
  );

  return (
    <div className={`tedxTicketWrap${hov ? " isHover" : ""}`}>
      <OrnCorner rotate={0} />
      <OrnCorner rotate={90} />
      <OrnCorner rotate={180} />
      <OrnCorner rotate={270} />
      <button
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
        className="tedxTicketBtn"
      >
        Book your Tickets
      </button>
    </div>
  );
};

/* ─── Hero ────────────────────────────────────────────────────────────────── */
const Hero = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const waveRef = useRef(null);
  const dotRef = useRef(null);
  const animRef = useRef(null);
  const dotAnimRef = useRef(null);

  /* ─── Dot grid canvas animation (upper half) ────────────────────────────── */
  useEffect(() => {
    const canvas = dotRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Build a fixed grid of dot positions once, re-used every frame
    const SPACING = 60;  // px between dots
    const buildGrid = () => {
      const cols = Math.ceil(canvas.width / SPACING) + 1;
      const rows = Math.ceil(canvas.height / SPACING) + 1;
      const pts = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          pts.push({
            bx: c * SPACING,          // base x
            by: r * SPACING,          // base y
            // each dot gets a unique phase so the "breathe" is not uniform
            phase: (r * cols + c) * 0.31,
            // random subtle drift magnitude (0 = dead still, 1 = small drift)
            drift: 0.4 + Math.random() * 0.6,
          });
        }
      }
      return pts;
    };

    let grid = buildGrid();
    window.addEventListener("resize", () => { resize(); grid = buildGrid(); });

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;

      // ── Dots at every intersection — bold and breathing ──
      grid.forEach(({ bx, by, phase, drift }) => {
        const pulse = Math.sin(t * 0.008 + phase);
        const vertFade = Math.max(0, 1 - (by / h) * 1.1);
        if (vertFade <= 0) return;
        const horzFade = Math.sin((bx / w) * Math.PI);

        const alpha = vertFade * 0.85 + pulse * 0.08;
        if (alpha <= 0.01) return;

        const radius = 2.2 + pulse * 0.5 * drift;

        // Centre column gold, outer dots silver-white
        const centreProx = Math.max(0, 1 - Math.abs(bx / w - 0.5) * 2.5);
        const rc = Math.round(200 + centreProx * 55);
        const gc = Math.round(190 + centreProx * 25);
        const bc = Math.round(180 - centreProx * 90);

        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rc},${gc},${bc},${alpha})`;
        ctx.fill();
      });

      t++;
      dotAnimRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (dotAnimRef.current) cancelAnimationFrame(dotAnimRef.current);
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(id);
  }, []);

  /* ─── Wave canvas animation ─────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = waveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    // Smoothed mouse position in canvas-space
    const mouse = { x: -9999, y: -9999, active: false };
    const smooth = { x: -9999, y: -9999 };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Smoothly chase the real mouse so ripple doesn't snap
      const lerpSpeed = 0.07;
      if (mouse.active) {
        smooth.x += (mouse.x - smooth.x) * lerpSpeed;
        smooth.y += (mouse.y - smooth.y) * lerpSpeed;
      }

      const LINES = 58;
      const waveBottom = h + 12;
      const waveTop = h * 0.06;
      const spread = waveBottom - waveTop;
      const spd = t * 0.00048;

      for (let i = 0; i < LINES; i++) {
        const frac = i / LINES;
        const yBase = waveTop + frac * spread;

        // ── base amplitudes — big and bold ──
        const amp1 = (70 + frac * 110) * Math.sin(frac * Math.PI);
        const amp2 = (38 + frac * 65) * Math.sin(frac * Math.PI * 0.7 + 0.5);
        const amp3 = (24 + frac * 38) * Math.sin(frac * Math.PI * 1.3 + 1.1);

        // ── cursor ripple — purely motion, zero colour change ──
        // distX: how far cursor is horizontally from this line's x-slice (0..1)
        // distY: how far cursor is from this line's baseline in canvas-space
        let ripple = 0;
        if (mouse.active) {
          const cx = smooth.x / w;                         // 0..1
          const cy = smooth.y;                             // px in canvas
          const dy = Math.abs(cy - yBase) / (h * 0.35);   // normalised vertical dist
          const distFalloff = Math.exp(-dy * dy * 2.5);      // gaussian falloff by row
          // The ripple adds a localised sine bump centred on the cursor x
          // — it travels outward as t advances, giving a "wave thrown from cursor" feel
          const phase = (cx - 0.5) * Math.PI * 5 + t * 0.018;
          ripple = distFalloff * 48 * Math.sin(phase) * Math.sin(Math.PI * frac);
        }

        // ── vivid crimson-red→gold, saturated and punchy ──
        const goldFrac = Math.pow(1 - frac, 1.6);
        const r = Math.round(255 * (1 - goldFrac) + 215 * goldFrac);
        const g = Math.round(28 * (1 - goldFrac) + 148 * goldFrac);
        const b = Math.round(10 * (1 - goldFrac) + 50 * goldFrac);

        // High base opacity — waves own the bottom half
        const opa =
          0.32 +
          0.78 *
          Math.sin(frac * Math.PI) *
          Math.pow(Math.sin(frac * Math.PI), 0.4);

        // Bold stroke widths
        const lw =
          frac < 0.07 || frac > 0.93 ? 0.6 :
            frac < 0.18 || frac > 0.82 ? 0.95 : 1.3;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${opa})`;
        ctx.lineWidth = lw;

        for (let x = 0; x <= w; x += 3) {
          const nx = x / w;
          // Cursor ripple contribution weighted by horizontal proximity to cursor
          const hWeight = mouse.active
            ? Math.exp(-Math.pow(nx - smooth.x / w, 2) * 14)
            : 0;
          const y =
            yBase +
            amp1 * Math.sin(nx * Math.PI * 1.8 + spd + frac * 0.9) +
            amp2 * Math.sin(nx * Math.PI * 3.1 - spd * 1.3 + frac * 1.5) +
            amp3 * Math.sin(nx * Math.PI * 4.7 + spd * 0.7 + frac * 2.2) +
            ripple * hWeight;                               // motion-only response
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050503",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap');

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%, 100% { opacity: 0.35; transform: scale(1);    }
          50%      { opacity: 0.6;  transform: scale(1.06); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0);  }
          50%      { transform: translateY(7px); }
        }
        .hero-line-1 { animation: heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s  both; }
        .hero-line-2 { animation: heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .hero-line-3 { animation: heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.65s both; }
        .hero-line-4 { animation: heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.85s both; }
        .hero-line-5 { animation: heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 1.05s both; }
        .hero-line-6 { animation: heroFadeUp 1s cubic-bezier(0.16,1,0.3,1) 1.25s both; }
      `}</style>



      {/* ── Wave canvas — sits at the bottom, behind everything ── */}
      <canvas
        ref={waveRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "42%",          /* waves occupy the lower 42% of the hero */
          zIndex: 1,
          pointerEvents: "none",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, black 70%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, black 70%)",
        }}
      />

      {/* ── Soft vignette over the waves so text stays readable ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "48%",
          background:
            "linear-gradient(to bottom, rgba(5,5,3,0) 0%, rgba(5,5,3,0.45) 55%, rgba(5,5,3,0.82) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: "900px",
          marginTop: "64px", /* Restored to prevent pushing everything down too far */
          opacity: ready ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        {/* Event label */}
        <div
          className="hero-line-1"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "6px" /* Reduced spacing between presents and Lexicon to pull the whole block closer */
          }}
        >
          <img src={logo} alt="TEDxIITTirupati" style={{ height: "72px", display: "block", marginBottom: "8px", objectFit: "contain" }} />
          <div style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 400,
            fontSize: "15px",
            letterSpacing: "7px",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase"
          }}>
            Presents
          </div>
        </div>

        {/* Main title */}
        <h1
          className="hero-line-2"
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontWeight: 300,
            fontSize: "clamp(72px, 11vw, 152px)",
            color: "#ffffff",
            lineHeight: 0.88,
            margin: "0 0 8px",
            letterSpacing: "-3px",
          }}
        >
          Lexicon
        </h1>

        {/* Subtitle */}
        <h2
          className="hero-line-3"
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(22px, 3.5vw, 48px)",
            color: "var(--gold)",
            lineHeight: 1.1,
            margin: "0 0 28px",
            letterSpacing: "5px",
          }}
        >
          of the Awakening
        </h2>

        {/* Separator */}
        <div
          className="hero-line-4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div style={{ width: "40px", height: "1px", background: "var(--gold-border)" }} />
          <span style={{ color: "var(--gold-dim)", fontSize: "8px", letterSpacing: "4px" }}>✦</span>
          <div style={{ width: "40px", height: "1px", background: "var(--gold-border)" }} />
        </div>

        {/* Tagline */}
        <p
          className="hero-line-4"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
            fontSize: "13px",
            letterSpacing: "3.5px",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
            margin: "0 0 52px",
          }}
        >
          Ideas Worth Spreading
        </p>

        {/* Timer */}
        <div className="hero-line-5">
          <Timer />
        </div>

        {/* CTA */}
        <div className="hero-line-6">
          <TicketButton onClick={() => navigate("/tickets")} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "36px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          animation: "heroFadeUp 1s 1.4s both",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--gold-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--gold-dim)",
            fontSize: "16px",
            animation: "scrollBounce 2.2s ease-in-out infinite, pulseRing 2.2s ease-in-out infinite",
          }}
        >
          ⌄
        </div>
      </div>
    </section>
  );
};

export default Hero;