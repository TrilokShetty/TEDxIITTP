import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TedxLogo = ({ onComplete }: { onComplete: () => void }) => {
  /* ── Phase A refs ──────────────────────────────────────────────────────── */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgWrapperRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const xRef = useRef<SVGPathElement | null>(null);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);

  /* ── Phase B refs ──────────────────────────────────────────────────────── */
  const lockupRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLDivElement | null>(null);
  const tedRef = useRef<HTMLSpanElement | null>(null);
  const xTextRef = useRef<HTMLSpanElement | null>(null);
  const iitRef = useRef<HTMLSpanElement | null>(null);
  const ruleRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<Array<HTMLSpanElement | null>>([]);

  const WORD = "TIRUPATI";
  const RED = "#EE2922";

  useEffect(() => {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;700&display=swap";
    document.head.appendChild(font);

    const containerEl = containerRef.current;
    const svgWrapperEl = svgWrapperRef.current;
    const logoEl = logoRef.current;
    const xEl = xRef.current;
    const paths = pathRefs.current;
    const lockupEl = lockupRef.current;
    const scanEl = scanRef.current;
    const tedEl = tedRef.current;
    const xTextEl = xTextRef.current;
    const iitEl = iitRef.current;
    const ruleEl = ruleRef.current;
    const letters = lettersRef.current;

    // Fallback: if animation doesn't call onComplete (e.g. guard failure), call it after a timeout
    const fallbackId = setTimeout(() => {
      onComplete();
    }, 12000); // Original animation was around 10s, giving some buffer.

    if (!containerEl || !svgWrapperEl || !logoEl || !xEl) {
      onComplete();
      return;
    }

    // The first 3 paths are T, E, D — the 4th (index 3) is X
    const tedPaths = paths.slice(0, 3);   // T, E, D
    const xPath = paths[3];            // X only

    /* ── Initial states ─────────────────────────────────────────────────── */
    gsap.set(paths, { opacity: 0 });
    gsap.set(lockupEl, { opacity: 0 });
    gsap.set(scanEl, { scaleX: 0, transformOrigin: "left" });
    gsap.set(tedEl, { opacity: 0, y: -22 });
    gsap.set(xTextEl, { opacity: 0, y: -16 });
    gsap.set(iitEl, { opacity: 0, y: 10 });
    gsap.set(letters, { opacity: 0, y: 20 });
    gsap.set(ruleEl, { scaleX: 0, transformOrigin: "left" });

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallbackId);
        onComplete();
      }
    });

    /* ════════════════════════════════════════════════════════════════════
       PHASE A — SVG stroke → fill for all 4 letters
    ════════════════════════════════════════════════════════════════════ */
    paths.forEach((path) => {
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
        fill: "none",
        stroke: RED,
      });
      tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" });
      tl.to(path, { fill: RED, duration: 0.3 }, "-=0.1");
    });

    /* ── Fade out T, E, D before zoom so they don't bleed into frame ─────── */
    tl.to(tedPaths, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    });

    /* ── Zoom viewBox into X — only the X is visible now ────────────────── */
    const xBBox = xEl.getBBox();
    const zoom = 0.4;
    const newW = xBBox.width / zoom;
    const newH = xBBox.height / zoom;
    const newX = xBBox.x - (newW - xBBox.width) / 2;
    const newY = xBBox.y - (newH - xBBox.height) / 2;

    tl.to(logoEl, {
      attr: { viewBox: `${newX} ${newY} ${newW} ${newH}` },
      duration: 1.4,
      ease: "power2.inOut",
    }, "-=0.1");

    /* ════════════════════════════════════════════════════════════════════
       TRANSITION — SVG breathes out + dissolves, lockup fades in
       Background stays dark the whole time
    ════════════════════════════════════════════════════════════════════ */
    const DISSOLVE = 1.1;

    tl.to(svgWrapperEl, {
      opacity: 0,
      scale: 1.14,
      duration: DISSOLVE,
      ease: "power2.inOut",
    });

    // Lockup starts materialising 40% into the dissolve
    tl.to(lockupEl, {
      opacity: 1,
      duration: DISSOLVE * 0.65,
      ease: "power1.out",
    }, `-=${DISSOLVE * 0.6}`);

    /* ════════════════════════════════════════════════════════════════════
       PHASE B — Cinematic text lockup reveal
    ════════════════════════════════════════════════════════════════════ */

    tl.to(scanEl, { scaleX: 1, duration: 0.65, ease: "power2.inOut" });

    tl.to(tedEl, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }, "-=0.42");
    tl.to(xTextEl, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" }, "-=0.28");

    tl.to(scanEl, { opacity: 0, duration: 0.3, ease: "power1.in" }, "-=0.1");

    tl.to(iitEl, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "-=0.1");

    tl.to(
      letters,
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.042 },
      "-=0.15"
    );

    tl.to(ruleEl, { scaleX: 1, duration: 0.55, ease: "expo.out" }, "-=0.2");

    tl.to({}, { duration: 1.8 });

    return () => {
      font.remove();
      clearTimeout(fallbackId);
    };
  }, [onComplete]);

  const jost: React.CSSProperties = { fontFamily: "'Jost', sans-serif" };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#050503",
        overflow: "hidden",
      }}
    >
      {/* ══ PHASE A — TEDx SVG ══════════════════════════════════════════════ */}
      <div
        ref={svgWrapperRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          ref={logoRef}
          viewBox="0 0 276 198"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "min(900px, 80vw)", height: "auto", display: "block" }}
        >
          <path ref={(el) => { pathRefs.current[0] = el; }}
            d="M45.1,83.3H27V66.7h56v16.5H64.9v48H45.1V83.3z" />
          <path ref={(el) => { pathRefs.current[1] = el; }}
            d="M86.1,66.7h54.4v16.5H106v8h34.5v15.4H106v8h34.5v16.5H86.1V66.7z" />
          <path ref={(el) => { pathRefs.current[2] = el; }}
            d="M163.7,114.7h7.8c12.4,0,14.2-10,14.2-16.1c0-4.1-1.3-15.3-15.6-15.3h-6.3V114.7z
               M143.8,66.7h32.6c21.5,0,29.1,15.9,29.1,32.2c0,19.8-10.5,32.3-33,32.3h-28.7V66.7z" />
          <path
            ref={(el) => { pathRefs.current[3] = el; xRef.current = el; }}
            d="M234.1,106.4L228,96.3l-5.9,10.1h-14.6L221.3,86L208,66.6h14.6l5.4,9.6l5.5-9.6h14.6
               L234.8,86l13.8,20.3H234.1z"
          />
        </svg>
      </div>

      {/* ══ PHASE B — Cinematic text lockup ════════════════════════════════ */}
      <div
        ref={lockupRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
        }}
      >
        {/* Scan line */}
        <div ref={scanRef} style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${RED} 40%, ${RED} 60%, transparent 100%)`,
          transform: "translateY(-50%)",
          zIndex: 10,
        }} />

        {/* Logo lockup */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>

            {/* TEDx */}
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span ref={tedRef} style={{
                ...jost,
                fontWeight: 700, fontSize: "clamp(34px, 7vw, 80px)",
                color: RED, letterSpacing: "0.02em", textTransform: "uppercase",
              }}>TED</span>
              <span ref={xTextRef} style={{
                ...jost,
                fontWeight: 700, fontSize: "clamp(16px, 3vw, 36px)",
                color: RED, verticalAlign: "super", lineHeight: 1,
              }}>x</span>
            </div>

            {/* IIT TIRUPATI — flush against TEDx, no gap */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "clamp(4px, 1vw, 12px)" }}>
              <span ref={iitRef} style={{
                ...jost,
                fontWeight: 700, fontSize: "clamp(34px, 7vw, 80px)",
                color: "rgba(255,255,255,0.88)",
                letterSpacing: "0 em", textTransform: "uppercase",
              }}>IIT</span>

              <span style={{ display: "flex", overflow: "hidden" }}>
                {WORD.split("").map((char, i) => (
                  <span key={i} ref={(el) => { lettersRef.current[i] = el; }} style={{
                    ...jost,
                    display: "inline-block",
                    fontWeight: 700, fontSize: "clamp(34px, 7vw, 80px)",
                    color: "rgba(255,255,255,0.88)",
                    letterSpacing: "0 em", textTransform: "uppercase",
                  }}>{char}</span>
                ))}
              </span>
            </div>
          </div>

          {/* Underline rule */}
          <div ref={ruleRef} style={{
            width: "100%", height: "1px",
            marginTop: "clamp(8px, 1.5vw, 16px)",
            background: `linear-gradient(90deg, ${RED} 0%, rgba(255,255,255,0.2) 100%)`,
          }} />
        </div>
      </div>
    </div>
  );
};

export default TedxLogo;