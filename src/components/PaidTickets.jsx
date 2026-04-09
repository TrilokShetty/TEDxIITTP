import { useState, useEffect } from "react";
import "./PaidTickets.css";

const PaidTickets = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/admin/paid-tickets");
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="pt-loader">Loading...</div>;
  if (error) return <div className="pt-error">Error: {error}</div>;

  const { summary, tickets } = data;

  return (
    <div className="pt-container">
      <div className="pt-content">
        <h1 className="pt-title">Paid Tickets Overview</h1>
        
        <div className="pt-summary-cards">
          <div className="pt-card pt-card-total">
            <h3>Total Passes Sold</h3>
            <p className="pt-value">{summary.totalPassesSold}</p>
            <p className="pt-sub">Revenue: ₹{summary.totalRevenue}</p>
          </div>
          {Object.entries(summary.byPassType).map(([id, stats]) => (
            <div key={id} className="pt-card">
              <h3>{stats.label} Passes</h3>
              <p className="pt-value">{stats.passesSold}</p>
              <p className="pt-sub">Revenue: ₹{stats.revenue}</p>
            </div>
          ))}
        </div>

        <div className="pt-table-container">
          <table className="pt-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Pass Type</th>
                <th>Passes</th>
                <th>Amount</th>
                <th>Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <tr key={t.paymentId}>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.phone}</td>
                    <td><span className={`pt-badge pt-badge-${t.passId}`}>{t.passLabel}</span></td>
                    <td className="pt-center">{t.numberOfPasses}</td>
                    <td>₹{t.amount}</td>
                    <td className="pt-mono">{t.paymentId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="pt-empty">No paid tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaidTickets;
