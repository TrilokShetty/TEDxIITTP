import { useState, useRef, useEffect, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./EntryDesk.css";

const SCANNER_ID = "ed-scanner-region";

const EntryDesk = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const scannerRef = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, []);

  const markEntry = useCallback(async (paymentId) => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/mark-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: paymentId.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Error ${res.status}`);
      }

      const data = await res.json();
      setResult(data);

      setHistory((prev) => [
        {
          paymentId: data.ticket.paymentId,
          name: data.ticket.name,
          passLabel: data.ticket.passLabel,
          alreadyEntered: data.alreadyEntered,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 49),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        cooldownRef.current = false;
      }, 1500);
    }
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    setResult(null);

    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 280, height: 280 },
          aspectRatio: 1,
          disableFlip: false,
        },
        (decodedText) => {
          markEntry(decodedText);
        },
        () => {}
      );
      setScanning(true);
    } catch {
      setError("Camera access denied or unavailable. Please allow camera permissions.");
      scannerRef.current = null;
    }
  }, [markEntry]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
    setScanning(false);
  }, []);

  const resetScan = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="ed-container">
      <div className="ed-content">
        {/* Header */}
        <div className="ed-header">
          <h1 className="ed-title">Entry Desk</h1>
          <p className="ed-subtitle">Scan attendee QR to verify and mark entry</p>
        </div>

        {/* Scanner */}
        <div className="ed-scanner-wrapper">
          <div
            id={SCANNER_ID}
            className={`ed-scanner-box ${scanning ? "ed-scanner-active" : ""}`}
          />

          {!scanning ? (
            <button className="ed-btn ed-btn-start" onClick={startScanner}>
              Start Scanner
            </button>
          ) : (
            <button className="ed-btn ed-btn-stop" onClick={stopScanner}>
              Stop Scanner
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="ed-loading">
            <div className="ed-spinner" />
            <span>Verifying ticket...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="ed-alert ed-alert-error">
            <div className="ed-alert-content">
              <strong>Not Found</strong>
              <p>{error}</p>
            </div>
            <button className="ed-btn-dismiss" onClick={resetScan}>Dismiss</button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div
            className={`ed-result-card ${
              result.alreadyEntered ? "ed-result-warn" : "ed-result-success"
            }`}
          >
            <div className="ed-result-status">
              <span className="ed-status-text">
                {result.alreadyEntered ? "ALREADY ENTERED" : "ENTRY MARKED"}
              </span>
            </div>

            <div className="ed-ticket-details">
              <div className="ed-detail-row">
                <span className="ed-label">Name</span>
                <span className="ed-value">{result.ticket.name}</span>
              </div>
              <div className="ed-detail-row">
                <span className="ed-label">Email</span>
                <span className="ed-value">{result.ticket.email}</span>
              </div>
              <div className="ed-detail-row">
                <span className="ed-label">Phone</span>
                <span className="ed-value">{result.ticket.phone}</span>
              </div>
              <div className="ed-detail-row">
                <span className="ed-label">Pass Type</span>
                <span className={`ed-badge ed-badge-${result.ticket.passId}`}>
                  {result.ticket.passLabel}
                </span>
              </div>
              <div className="ed-detail-row">
                <span className="ed-label">Passes</span>
                <span className="ed-value ed-value-lg">{result.ticket.numberOfPasses}</span>
              </div>
              <div className="ed-detail-row">
                <span className="ed-label">Amount</span>
                <span className="ed-value">{result.ticket.amount}</span>
              </div>
              <div className="ed-detail-row">
                <span className="ed-label">Payment ID</span>
                <span className="ed-value ed-mono">{result.ticket.paymentId}</span>
              </div>
            </div>

            <button className="ed-btn ed-btn-next" onClick={resetScan}>
              Scan Next
            </button>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="ed-history">
            <h2 className="ed-history-title">Recent Scans</h2>
            <div className="ed-history-list">
              {history.map((h, i) => (
                <div
                  key={`${h.paymentId}-${i}`}
                  className={`ed-history-item ${
                    h.alreadyEntered ? "ed-history-warn" : "ed-history-ok"
                  }`}
                >
                  <div className="ed-history-main">
                    <span className="ed-history-name">{h.name}</span>
                    <span className="ed-history-pass">{h.passLabel}</span>
                  </div>
                  <div className="ed-history-meta">
                    <span className={`ed-history-status ${h.alreadyEntered ? "ed-hs-warn" : "ed-hs-ok"}`}>
                      {h.alreadyEntered ? "DUPLICATE" : "ENTERED"}
                    </span>
                    <span className="ed-history-time">{h.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryDesk;
