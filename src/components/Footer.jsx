import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-white.png";

/* ─── Ornamental divider SVG ─────────────────────────────────────────────── */
const OrnDivider = () => (
  <svg
    width="320"
    height="18"
    viewBox="0 0 320 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", margin: "0 auto" }}
  >
    <line x1="0" y1="9" x2="132" y2="9" stroke="var(--gold-dim)" strokeWidth="0.8" />
    <polygon points="140,9 147,4 154,9 147,14" fill="none" stroke="var(--gold-dim)" strokeWidth="0.8" />
    <circle cx="160" cy="9" r="2.5" fill="var(--gold)" opacity="0.9" />
    <polygon points="166,9 173,4 180,9 173,14" fill="none" stroke="var(--gold-dim)" strokeWidth="0.8" />
    <line x1="188" y1="9" x2="320" y2="9" stroke="var(--gold-dim)" strokeWidth="0.8" />
  </svg>
);

/* ─── Small ornamental corner for a box ─────────────────────────────────── */
const CornerOrnament = ({ pos }) => {
  const styles = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0, transform: "scaleX(-1)" },
    bl: { bottom: 0, left: 0, transform: "scaleY(-1)" },
    br: { bottom: 0, right: 0, transform: "scale(-1,-1)" },
  };
  return (
    <svg
      width="18" height="18" viewBox="0 0 18 18"
      style={{ position: "absolute", ...styles[pos], opacity: 0.55 }}
    >
      <line x1="9" y1="0" x2="9" y2="9" stroke="var(--gold)" strokeWidth="0.8" />
      <line x1="0" y1="9" x2="9" y2="9" stroke="var(--gold)" strokeWidth="0.8" />
      <circle cx="9" cy="9" r="1.5" fill="var(--gold)" />
    </svg>
  );
};

/* ─── Social icon links ──────────────────────────────────────────────────── */
const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/tedxiittirupati",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/tedx-iittirupati",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@IITTirupatiofficial",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42A2.78 2.78 0 0 0 20.6 4.46C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  
];

/* ─── Footer ─────────────────────────────────────────────────────────────── */
const Footer = () => {
  const [emailHover, setEmailHover] = useState(false);

  return (
    <footer id = "footer"
      style={{
        background: "#050503",
        borderTop: "1px solid var(--gold-border)",
        padding: "72px 0 0",
        fontFamily: "'Jost', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .ftx-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* top grid */
        .ftx-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 56px;
          padding-bottom: 56px;
        }

        @media (max-width: 860px) {
          .ftx-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .ftx-col-brand { grid-column: 1 / -1; }
        }

        @media (max-width: 520px) {
          .ftx-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Contact info rows */
        .ftx-info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }
        .ftx-info-icon {
          color: var(--gold);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .ftx-info-text {
          font-size: 13.5px;
          font-weight: 400;
          color: rgba(255,255,255,0.75);
          line-height: 1.7;
          letter-spacing: 0.3px;
        }
        .ftx-info-text a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ftx-info-text a:hover { color: var(--gold); }

        /* Nav links */
        .ftx-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ftx-nav-list li a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          padding: 6px 0;
          transition: color 0.25s, gap 0.25s;
          position: relative;
        }
        .ftx-nav-list li a::before {
          content: '';
          display: block;
          width: 0;
          height: 1px;
          background: var(--gold);
          transition: width 0.25s;
          flex-shrink: 0;
        }
        .ftx-nav-list li a:hover {
          color: var(--gold);
          gap: 12px;
        }
        .ftx-nav-list li a:hover::before {
          width: 16px;
        }

        /* Section heading */
        .ftx-section-label {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ftx-section-label::after {
          content: '';
          flex: 1;
          max-width: 40px;
          height: 1px;
          background: var(--gold-border);
        }

        /* Social pills */
        .ftx-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .ftx-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--gold-border);
          background: transparent;
          cursor: pointer;
          color: rgba(255,255,255,0.65);
          transition: color 0.25s, border-color 0.25s, background 0.25s;
          text-decoration: none;
          position: relative;
        }
        .ftx-social-btn:hover {
          color: var(--gold);
          border-color: var(--gold-dim);
          background: var(--gold-glow);
        }

        /* bottom bar */
        .ftx-bottom {
          border-top: 1px solid var(--gold-border);
          padding: 22px 32px;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ftx-bottom-text {
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
        }
        .ftx-bottom-badge {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gold-bright);
          font-weight: 400;
        }

        /* ambient glow */
        .ftx-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 180px;
          background: radial-gradient(ellipse at 50% 100%, var(--gold-glow) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      {/* Ambient glow */}
      <div className="ftx-glow" />

      {/* Ornamental top divider */}
      <div style={{ marginBottom: "52px" }}>
        <OrnDivider />
      </div>

      <div className="ftx-wrap">
        <div className="ftx-grid">

          {/* ── Brand + Contact ── */}
          <div className="ftx-col-brand">
            {/* Logo */}
            <div style={{ marginBottom: "28px", textAlign: "left" }}>
              <Link to="/" onClick={() => window.scrollTo(0, 0)} style={{ textDecoration: 'none', display: "inline-flex", flexDirection: "column", alignItems: "center", marginLeft: "-14px" }}>
                <img src={logo} alt="TEDxIITTirupati" style={{ height: "42px", display: "block", margin: 0 }} />
                <div style={{
                  fontFamily: '"Arial", Helvetica, sans-serif',
                  fontSize: "9.6px",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.95)",
                  marginTop: "1px",
                  letterSpacing: "0.2px",
                  whiteSpace: "nowrap"
                }}>
                  <span style={{ color: "red", fontWeight: 600 }}>x</span> = independently organized <span style={{ color: "#EB0028", fontWeight: 700 }}>TED</span> event
                </div>
              </Link>
            </div>

            {/* Theme reminder */}
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "17px",
              color: "var(--gold)",
              letterSpacing: "1px",
              lineHeight: 1.4,
              margin: "0 0 32px",
            }}>
              Lexicon of the Awakening
            </p>

            {/* Contact info */}
            <p className="ftx-section-label">Contact</p>

            <div className="ftx-info-row">
              <span className="ftx-info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <span className="ftx-info-text">
                <a href="mailto:ted@iittp.ac.in">ted@iittp.ac.in</a>
              </span>
            </div>

            <div className="ftx-info-row">
              <span className="ftx-info-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 18 19.45 19.45 0 0 1 5 11.37 19.79 19.79 0 0 1 2.08 2.18 2 2 0 0 1 4.11 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 7.91a16 16 0 0 0 8 8l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 16.92z"/>
                </svg>
              </span>
              <span className="ftx-info-text">
                <a href="tel:+917397460482">+91 73974 60482</a>
                {" · "}
                <a href="tel:+918122663608">+91 81226 63608</a>
              </span>
            </div>

            <div className="ftx-info-row">
              <span className="ftx-info-icon" style={{ marginTop: "3px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span className="ftx-info-text">
                ECell Office, TIH Building, 2nd Floor,<br />
                IIT Tirupati, Yepedu,<br />
                Tirupati, Andhra Pradesh — 517619
              </span>
            </div>

            {/* Social buttons */}
            <div className="ftx-socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="ftx-social-btn"
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* ── Important Links ── */}
          <div>
            <p className="ftx-section-label">Navigate</p>
            <ul className="ftx-nav-list">
              {[
                { label: "Home", href: "/" },
                { label: "Speakers", href: "/speakers" },
                { label: "Sponsors", href: "/sponsors" },
                { label: "Team", href: "/team" },
                { label: "Tickets", href: "/tickets" },
                { label: "Rewind", href: "/rewind" },
                { label: "About", href: "/about" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal / Policies ── */}
          <div>
            <p className="ftx-section-label">Legal</p>
            <ul className="ftx-nav-list">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>

            {/* TED license note */}
            <div
              style={{
                marginTop: "36px",
                padding: "18px",
                border: "1px solid var(--gold-border)",
                position: "relative",
              }}
            >
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <p style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                margin: 0,
                letterSpacing: "0.3px",
              }}>
                This independent TEDx event is operated under licence from{" "}
                <span style={{ color: "#EE2922", fontWeight: 400 }}>TED</span>.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid var(--gold-border)", marginTop: "0" }}>
        <div className="ftx-bottom">
          <span className="ftx-bottom-text">
            © {new Date().getFullYear()} TEDxIITTirupati. All rights reserved.
          </span>
          <span className="ftx-bottom-badge">Ideas Worth Spreading</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;