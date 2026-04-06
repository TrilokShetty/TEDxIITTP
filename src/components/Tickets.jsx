import { useState, useEffect, useRef } from "react";
import "./Tickets.css";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const BOOKING_ENABLED = false;

const PASSES = [
  {
    id: "regular",
    label: "Regular Pass",
    price: 349,
    tagline: "Your gateway to ideas worth spreading.",
    perks: [
      "Access to all 6 TEDx Talks",
      "Exclusive TEDxIIT Tirupati Goodies",
      "Brand Kit: Exclusive Bag, Notepad, Pen, Badge",
      "Refreshments & Snacks",
      "An Unforgettable TEDx Experience",
    ],
    highlighted: false,
  },
  {
    id: "premium",
    label: "Premium Pass",
    price: 549,
    tagline: "Immerse deeper. Engage fully. Remember forever.",
    perks: [
      "Access to all 6 TEDx Talks",
      "Priority Seating - reserved front rows",
      "Exclusive TEDxIIT Tirupati Goodies",
      "Brand Kit: Exclusive Bag, Official ID Card, Notepad, Pen, Badge, Keychain, Canvas Pouch, Bookmark & Sticker",
      "Refreshments & Snacks",
      "An Unforgettable TEDx Experience",
    ],
    highlighted: true,
  },
];

// ── INSTAMOJO SCRIPT LOADER ──────────────────────────────────────────────────
function loadInstamojo() {
  return new Promise((resolve) => {
    if (window.Instamojo) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://js.instamojo.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── ANIMATED PRICE DIGIT ──────────────────────────────────────────────────────
function AnimatedDigit({ targetDigit, revealed, delay = 0 }) {
  const [displayDigit, setDisplayDigit] = useState(Math.floor(Math.random() * 10));
  const [locked, setLocked] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (revealed) {
      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        setDisplayDigit(targetDigit);
        setLocked(true);
      }, delay);
      return () => {
        clearTimeout(timeoutRef.current);
        clearInterval(intervalRef.current);
      };
    }

    const tick = () => {
      setDisplayDigit(Math.floor(Math.random() * 10));
      intervalRef.current = setTimeout(tick, 300 + Math.random() * 200);
    };
    intervalRef.current = setTimeout(tick, Math.random() * 400);

    return () => clearTimeout(intervalRef.current);
  }, [revealed, targetDigit, delay]);

  return (
    <span
      className={`price-digit ${locked ? "price-digit--locked" : "price-digit--rolling"}`}
    >
      {displayDigit}
    </span>
  );
}

// ── ANIMATED PRICE DISPLAY ────────────────────────────────────────────────────
function AnimatedPrice({ price }) {
  const digits = String(price).split("").map(Number);

  if (BOOKING_ENABLED) {
    return (
      <div className="pass-price">
        <span className="pass-currency">₹</span>
        <span className="pass-amount pass-amount--revealed">
          {digits.map((d, i) => (
            <AnimatedDigit key={i} targetDigit={d} revealed={true} delay={i * 120} />
          ))}
        </span>
      </div>
    );
  }

  return (
    <div className="pass-price">
      <span className="pass-currency pass-currency--hidden">₹</span>
      <span className="pass-amount">
        {digits.map((_, i) => (
          <AnimatedDigit key={i} targetDigit={0} revealed={false} delay={0} />
        ))}
      </span>
      <span className="price-mystery-label" aria-label="Price revealed at booking">
        <span className="price-mystery-text">Reveal on launch</span>
      </span>
    </div>
  );
}

// ── PERK ITEM ─────────────────────────────────────────────────────────────────
function PerkItem({ text }) {
  return (
    <li className="perk-item">
      <span className="perk-check" aria-hidden="true">
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span>{text}</span>
    </li>
  );
}

// ── USER DETAILS MODAL ───────────────────────────────────────────────────────
function UserDetailsModal({ pass, onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.replace(/[\s-]/g, "") });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="modal-title">Complete Your Booking</h2>
        <p className="modal-subtitle">
          {pass.label} — <span className="modal-price">₹{pass.price}</span>
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-label">
            <span>Full Name</span>
            <input
              type="text"
              className="modal-input"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>

          <label className="modal-label">
            <span>Email</span>
            <input
              type="email"
              className="modal-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="modal-label">
            <span>Phone</span>
            <input
              type="tel"
              className="modal-input"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="modal-submit">
            Proceed to Pay &nbsp;→
          </button>
        </form>
      </div>
    </div>
  );
}

// ── PASS CARD ─────────────────────────────────────────────────────────────────
function PassCard({ pass, selected, onSelect, onBook }) {
  return (
    <div
      className={`pass-card ${pass.highlighted ? "pass-card--premium" : ""} ${selected ? "pass-card--selected" : ""}`}
      onClick={() => onSelect(pass.id)}
    >
      {pass.highlighted && (
        <div className="pass-badge">Most Popular</div>
      )}

      <div className="pass-header">
        <span className="pass-label">{pass.label}</span>
        <AnimatedPrice price={pass.price} />
        <p className="pass-tagline">{pass.tagline}</p>
      </div>

      <div className="pass-divider" />

      <ul className="pass-perks">
        {pass.perks.map((p) => (
          <PerkItem key={p} text={p} />
        ))}
      </ul>

      <button
        className={`pass-cta ${!BOOKING_ENABLED ? "pass-cta--disabled" : ""}`}
        disabled={!BOOKING_ENABLED}
        onClick={(e) => { e.stopPropagation(); if (BOOKING_ENABLED) onBook(pass); }}
        aria-label={BOOKING_ENABLED ? `Book ${pass.label}` : "Bookings Starting Soon"}
      >
        <span>{BOOKING_ENABLED ? `Book ${pass.label}` : "Bookings Starting Soon"}</span>
        {BOOKING_ENABLED && (
          <svg className="cta-arrow" viewBox="0 0 20 10" fill="none">
            <path d="M0 5H18M14 1L18 5L14 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Updated branding */}
      <p className="pass-note">Powered by Instamojo · Secure checkout</p>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Tickets() {
  const [selected, setSelected] = useState("premium");
  const [visible, setVisible] = useState(false);
  const [modalPass, setModalPass] = useState(null);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleBook = (pass) => setModalPass(pass);

  const handleModalSubmit = async ({ name, email, phone }) => {
    const pass = modalPass;
    setModalPass(null);
    setPaying(true);

    try {
      // 1. Load the Instamojo checkout script
      const scriptLoaded = await loadInstamojo();
      if (!scriptLoaded) {
        showToast("Failed to load payment gateway. Please check your connection.");
        setPaying(false);
        return;
      }

      // 2. Ask your backend to create an Instamojo payment link for this buyer
      //    Your server should call the Instamojo API and return { paymentUrl }
      const linkRes = await fetch(`/api/create-payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pass.price,
          passId: pass.id,
          passLabel: pass.label,
          name,
          email,
          phone,
        }),
      });

      if (!linkRes.ok) {
        const errData = await linkRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create payment link.");
      }

      const { paymentUrl } = await linkRes.json();

      // 3. Wire up Instamojo success/failure handlers before opening
      window.Instamojo.configure({
        handlers: {
          onOpen: () => {
            // Checkout modal is now visible — nothing extra needed
          },
          onClose: () => {
            // User dismissed without paying
            setPaying(false);
            showToast("Payment was cancelled. You can try again anytime.", "warning");
          },
          onSuccess: (response) => {
            // response contains: paymentId, paymentRequestId, paymentStatus, etc.
            window.location.href = `/ticket-confirmed?id=${response.paymentId}&pass=${pass.id}`;
          },
          onFailure: (response) => {
            console.error("Instamojo payment failed:", response);
            showToast("Payment could not be completed. Please try again.");
            setPaying(false);
          },
        },
      });

      // 4. Open the Instamojo checkout form
      window.Instamojo.open(paymentUrl);

    } catch (err) {
      console.error("Checkout error:", err);
      showToast(err.message || "Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  return (
    <>
      <header className="tix-header">
        <div className="tix-header__glow" />
        <div className={`tix-header__inner ${visible ? "tix-visible" : ""}`}>
          <span className="tix-eyebrow">TEDxIITTirupati · 2026</span>
          <h1 className="tix-title">
            Reserve Your <em>Seat</em>
          </h1>
          <div className="tix-rule">
            <span /><i /><span />
          </div>
          <p className="tix-subtitle">
            Lexicon of the Awakening &nbsp;·&nbsp; April 12, 2026
          </p>
        </div>
      </header>

      <section className="tix-section">
        <div className={`tix-grid ${visible ? "tix-visible" : ""}`}>
          {PASSES.map((pass) => (
            <PassCard
              key={pass.id}
              pass={pass}
              selected={selected === pass.id}
              onSelect={setSelected}
              onBook={handleBook}
            />
          ))}
        </div>

        <p className="tix-legal">
          All sales are final. Tickets are non-transferable.
          By purchasing you agree to the{" "}
          <a href="/terms-and-conditions" className="tix-link">Terms & Conditions</a>.
        </p>
      </section>

      {modalPass && (
        <UserDetailsModal
          pass={modalPass}
          onSubmit={handleModalSubmit}
          onClose={() => setModalPass(null)}
        />
      )}

      {paying && (
        <div className="payment-overlay">
          <span className="cta-spinner payment-spinner" />
          <p className="payment-overlay-text">Processing payment…</p>
        </div>
      )}

      {toast && (
        <div className={`toast-notification toast--${toast.type}`}>
          <span className="toast-icon" aria-hidden="true">
            {toast.type === "warning" ? (
              <svg viewBox="0 0 20 20" fill="none"><path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/></svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            )}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)} aria-label="Dismiss">
            <svg viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      )}
    </>
  );
}