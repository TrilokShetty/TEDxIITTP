import React, { useState } from "react";
import "./ComingSoon.css";

const Ornament = () => (
  <div className="ornament">
    <span className="ornament__line" />
    <span className="ornament__diamond" />
    <span className="ornament__dot" />
    <span className="ornament__diamond" />
    <span className="ornament__line ornament__line--reverse" />
  </div>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="coming-soon" aria-label="Coming soon">

      

      <h1 className="cs__heading">Coming Soon</h1>
      <p className="cs__theme">Lexicon of the Awakening</p>
      <p className="cs__tagline">Ideas Worth Spreading</p>

      <Ornament />

      <p className="cs__message">
        The words that will define this era are still being written —{" "}
        <strong>and you'll be there when they are spoken.</strong>{" "}
        Something extraordinary is taking shape. Sit with the anticipation;
        it sharpens the mind for what's to come.
      </p>

      

      <div className="cs__scroll-hint" aria-hidden="true">
        <div className="scroll-chevron"><IconChevron /></div>
      </div>

    </section>
  );
} 