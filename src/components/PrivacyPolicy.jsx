import { useEffect } from 'react';
import './PrivacyPolicy.css';

function usePPReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.pp-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('pp-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const sections = [
  {
    num: '01',
    title: 'Information We Collect',
    body: [
      'When you register for TEDx IIT Tirupati or use our website, we may collect personal information such as your name, email address, phone number, and other details provided during registration.',
      'We also collect technical information including IP address, browser type, and usage data through cookies or analytics tools. If applicable, payment information for ticket purchases is processed securely by third-party providers — we do not store credit card details.',
    ],
  },
  {
    num: '02',
    title: 'How We Use Your Information',
    body: [
      'Your information is used to process your event registration and send confirmations, updates, and reminders. We also use it to respond to inquiries, improve the website experience, and comply with legal obligations.',
      'We will never use your data for purposes beyond those described in this policy without your explicit consent.',
    ],
  },
  {
    num: '03',
    title: 'Sharing Your Information',
    body: [
      'We respect your privacy and will never sell your information. We may share your data with trusted third-party vendors — such as payment processors or email services — who assist us in operating the event.',
      'We may also disclose information if required by law or to protect our rights, property, or safety.',
    ],
  },
  {
    num: '04',
    title: 'Cookies & Tracking',
    body: [
      'Our website uses cookies to enhance your browsing experience and analyse site performance. You may adjust your browser settings to manage or disable cookies at any time.',
      'Disabling cookies may affect certain features of the website.',
    ],
  },
  {
    num: '05',
    title: 'Data Security',
    body: [
      'We implement appropriate technical and organisational measures to safeguard your data. However, no method of transmission over the internet is entirely secure.',
      'We encourage you to contact us immediately if you suspect any unauthorised access to your information.',
    ],
  },
  {
    num: '06',
    title: 'Your Rights',
    body: [
      'You have the right to access, update, or correct your personal information at any time. You may also request deletion of your data, except where we are legally required to retain it.',
      'To exercise any of these rights, or to opt out of non-essential communications, please contact us at ted@iittp.ac.in.',
    ],
  },
  {
    num: '07',
    title: 'Third-Party Links',
    body: [
      'Our website may contain links to external sites. We are not responsible for the privacy practices of those sites and encourage you to review their respective policies.',
    ],
  },
  {
    num: '08',
    title: 'Updates to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date. Continued use of our website after changes constitutes acceptance of the updated policy.',
    ],
  },
];

export default function PrivacyPolicy() {
  usePPReveal();

  return (
    <div className="pp-page">

      {/* ── Header ── */}
      <header className="pp-header">
        <div className="pp-header__bg" />
        <div className="pp-header__inner">
          <span className="pp-eyebrow">Legal</span>
          <h1 className="pp-title">Privacy <em>Policy</em></h1>
          <div className="pp-rule">
            <span /><i /><span />
          </div>
          <p className="pp-tagline">Effective — March 2026</p>
        </div>
      </header>

      {/* ── Intro ── */}
      <div className="pp-intro-wrap pp-reveal">
        <div className="pp-intro">
          <p className="pp-intro__text">
            Welcome to the official website of TEDx IIT Tirupati. Your privacy is important to us.
            This policy explains how we collect, use, and safeguard your data when you register
            for our event or interact with our website.
          </p>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="pp-sections">
        {sections.map((sec, i) => (
          <div
            key={sec.num}
            className={`pp-section pp-reveal${i % 2 === 1 ? ' pp-reveal-d1' : ''}`}
          >
            <div className="pp-section__divider" />
            <div className="pp-section__inner">
              <div className="pp-section__meta">
                <span className="pp-chip">{sec.num}</span>
                <h2 className="pp-sec-heading">{sec.title}</h2>
              </div>
              <div className="pp-section__body">
                {sec.body.map((para, j) => (
                  <p key={j} className="pp-body">{para}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Contact CTA ── */}
      <section className="pp-contact pp-reveal">
        <div className="pp-contact__glow" />
        <span className="pp-chip">Contact</span>
        <h2 className="pp-contact__heading">
          Questions about this <em>Policy?</em>
        </h2>
        <p className="pp-body pp-contact__body">
          If you have any questions about how your information is handled,
          please reach out to us directly. We aim to respond within 48 hours.
        </p>
        <div className="pp-contact__details">
          <a href="mailto:ted@iittp.ac.in" className="pp-contact__link">
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
          <span className="pp-contact__sep">·</span>
          <span className="pp-contact__addr">
            ECell Office, TIH Building, 2nd Floor, IIT Tirupati, Yepedu,
            Andhra Pradesh — 517619
          </span>
        </div>
      </section>

    </div>
  );
}