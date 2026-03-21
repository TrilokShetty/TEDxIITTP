import React from "react";
import "./TedxLogoText.css";

/**
 * TedxLogoText — 2-line stacked logo matching reference design.
 *
 *   TEDx            ← red, Jost 900
 *   IITTirupati     ← white, Jost 300
 *   x = indep...    ← tagline (optional)
 *
 * Sizing — override from parent context:
 *   navbar  →  .tedxNavbarLogo .tedxLogo { font-size: clamp(11px, 1.3vw, 15px); }
 *   hero    →  .heroLogo       .tedxLogo { font-size: clamp(28px, 5vw,  60px);  }
 *
 * Props:
 *   showTagline  {boolean}  show tagline row (default: true)
 *   className    {string}   extra class on root
 */
const TedxLogoText = ({ showTagline = true, className = "" }) => (
  <div className={`tedxLogo${className ? " " + className : ""}`}>

    {/* Row 1 — TEDx */}
    <div className="tedxLogoLine1">
      <span className="tedxLogoTed">TED</span>
      <span className="tedxLogoX">x</span>
    </div>

    {/* Row 2 — IITTirupati */}
    <span className="tedxLogoLocation">IITTirupati</span>

    {/* Row 3 — Tagline */}
    {showTagline && (
      <div className="tedxLogoTagline">
        <span className="tedxLogoTaglineX">x</span>
        <span className="tedxLogoTaglineText">
          = independently organized TED event
        </span>
      </div>
    )}

  </div>
);

export default TedxLogoText;