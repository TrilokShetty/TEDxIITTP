import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./TicketConfirmed.css";

export default function TicketConfirmed() {
  const [params] = useSearchParams();
  const [visible, setVisible] = useState(false);

  const paymentId = params.get("id") || "—";
  const passId = params.get("pass") || "unknown";
  const numberOfPasses = params.get("count") || "1";

  const passLabel =
    passId === "premium" ? "Premium Pass" :
    passId === "regular" ? "Regular Pass" :
    passId === "access" ? "Access Pass" : passId;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`confirmed-page ${visible ? "confirmed-visible" : ""}`}>
      <div className="confirmed-card">
        <div className="confirmed-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 24L21 31L34 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="confirmed-title">Booking Confirmed!</h1>
        <p className="confirmed-subtitle">
          Thank you for booking the <strong>{passLabel}</strong> for TEDxIITTirupati 2026.
        </p>

        <div className="confirmed-details">
          <div className="confirmed-row">
            <span className="confirmed-label">Transaction ID</span>
            <span className="confirmed-value">{paymentId}</span>
          </div>
          <div className="confirmed-row">
            <span className="confirmed-label">Pass Type</span>
            <span className="confirmed-value">{passLabel}</span>
          </div>
          <div className="confirmed-row">
            <span className="confirmed-label">Number of Passes</span>
            <span className="confirmed-value">{numberOfPasses}</span>
          </div>
          <div className="confirmed-row">
            <span className="confirmed-label">Event Date</span>
            <span className="confirmed-value">April 12, 2026</span>
          </div>
        </div>

        <p className="confirmed-note">
          Please save your Transaction ID for reference.
        </p>

        <Link to="/" className="confirmed-cta">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
