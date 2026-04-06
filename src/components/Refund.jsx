import { useEffect } from 'react';
import './Refund.css';

function useRCReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rc-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rc-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const refundSections = [
  {
    num: '01',
    title: 'No-Refund Policy',
    body: [
      'All ticket purchases for TEDx IIT Tirupati are final. Once a transaction has been completed and confirmed, no refunds will be issued under any circumstances, including but not limited to change of plans, scheduling conflicts, or personal emergencies.',
      'By completing your purchase, you acknowledge and accept this no-refund policy in full. We strongly encourage you to review event details, dates, and venue information carefully before proceeding to checkout.',
    ],
  },
  {
    num: '02',
    title: 'Non-Transferability',
    body: [
      'Tickets are strictly non-transferable. The name and details submitted at the time of purchase are the only credentials authorised for entry. Tickets may not be resold, gifted, or reassigned to another individual.',
      'Any attempt to transfer, resell, or duplicate a ticket may result in permanent cancellation of the ticket without compensation. TEDx IIT Tirupati reserves the right to deny entry to individuals presenting tickets not registered in their name.',
    ],
  },
  {
    num: '03',
    title: 'Event Cancellation by Organiser',
    body: [
      'In the unlikely event that TEDx IIT Tirupati is cancelled or postponed by the organising team due to circumstances beyond our control — including but not limited to natural disasters, institutional directives, or force majeure events — registered attendees will be notified via the email address provided at registration.',
      'In the case of full cancellation, a refund may be issued at the sole discretion of the organising committee. If the event is rescheduled, your ticket will remain valid for the new date. No additional compensation will be provided.',
    ],
  },
  {
    num: '04',
    title: 'Failed or Duplicate Payments',
    body: [
      'If your payment fails after being charged, please contact us immediately at ted@iittp.ac.in with your transaction reference number. We will investigate and resolve the issue within 5–7 business days in coordination with our payment gateway provider.',
      'In the case of a verified duplicate charge for the same ticket, the excess amount will be refunded to the original payment method within 7–10 business days. Please retain all transaction confirmations for your records.',
    ],
  },
  {
    num: '05',
    title: 'Entry Denial & Removal',
    body: [
      'Tickets are void if tampered with, duplicated, or obtained through unauthorised means. Attendees denied entry or removed from the event due to policy violations, misconduct, or use of fraudulent tickets are not entitled to any refund or compensation.',
      'All decisions regarding entry denial or removal rest solely with the TEDx IIT Tirupati event team and are final.',
    ],
  },
  {
    num: '06',
    title: 'Contact & Disputes',
    body: [
      'For any payment-related queries, billing discrepancies, or concerns regarding this policy, please reach out to us at ted@iittp.ac.in within 7 days of your transaction date. Requests submitted beyond this window may not be considered.',
      'TEDx IIT Tirupati reserves the right to amend this Refund & Cancellation Policy at any time. The version in effect at the time of your purchase governs your transaction.',
    ],
  },
];

export default function Refund() {
  useRCReveal();

  return (
    <div className="rc-page">

      {/* ── Header ── */}
      <header className="rc-header">
        <div className="rc-header__bg" />
        <div className="rc-header__inner">
          <span className="rc-eyebrow">Policy</span>
          <h1 className="rc-title">Refund &amp; <em>Cancellation</em></h1>
          <div className="rc-rule">
            <span /><i /><span />
          </div>
          <p className="rc-tagline">Effective — March 2026</p>
        </div>
      </header>

      {/* ── Intro ── */}
      <div className="rc-intro-wrap rc-reveal">
        <div className="rc-intro">
          <p className="rc-intro__text">
            Please read this policy carefully before purchasing your ticket.
            All sales are final — by completing your registration you agree to
            the terms outlined below.
          </p>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="rc-sections">
        {refundSections.map((sec, i) => (
          <div
            key={sec.num}
            className={`rc-section rc-reveal${i % 2 === 1 ? ' rc-reveal-d1' : ''}`}
          >
            <div className="rc-section__divider" />
            <div className="rc-section__inner">
              <div className="rc-section__meta">
                <span className="rc-chip">{sec.num}</span>
                <h2 className="rc-sec-heading">{sec.title}</h2>
              </div>
              <div className="rc-section__body">
                {sec.body.map((para, j) => (
                  <p key={j} className="rc-body">{para}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Contact CTA ── */}
      <section className="rc-contact rc-reveal">
        <div className="rc-contact__glow" />
        <span className="rc-chip">Contact</span>
        <h2 className="rc-contact__heading">
          Payment issue or <em>query?</em>
        </h2>
        <p className="rc-body rc-contact__body">
          If you believe you've been charged incorrectly or have a question about
          this policy, write to us. We aim to respond within 48 hours.
        </p>
        <div className="rc-contact__details">
          <a href="mailto:ted@iittp.ac.in" className="rc-contact__link">
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            ted@iittp.ac.in
          </a>
          <span className="rc-contact__sep">·</span>
          <span className="rc-contact__addr">
            ECell Office, TIH Building, 2nd Floor, IIT Tirupati, Yepedu,
            Andhra Pradesh — 517619
          </span>
        </div>
      </section>

    </div>
  );
}