import { useEffect } from 'react';
import './TnC.css';

function useTCReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.tc-reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('tc-visible');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const tedxSections = [
  {
    num: '01',
    title: 'Terms of Use',
    body: [
      'Use of this website is strictly for personal, non-commercial purposes. You may not attempt to breach site security, reverse-engineer any component, or distribute malicious content through our platform.',
      'Any unauthorized use of the site or its content may result in immediate suspension of access and, where applicable, legal action.',
    ],
  },
  {
    num: '02',
    title: 'Ticket Purchase',
    body: [
      'All tickets must be purchased exclusively through this website. All sales are final — tickets are non-refundable and non-transferable once purchased.',
      'Payments are processed securely through our payment gateway. TEDx IIT Tirupati does not store your payment card information.',
    ],
  },
  {
    num: '03',
    title: 'Privacy & Data Usage',
    body: [
      'Personal information such as your name, email address, and payment details is collected solely for registration and event management purposes.',
      'Please refer to our Privacy Policy for full details on how your data is collected, used, and protected.',
    ],
  },
  {
    num: '04',
    title: 'Event Conduct',
    body: [
      'All attendees are expected to conduct themselves respectfully throughout the event. Disruptive behaviour, harassment of any kind, or failure to comply with event staff instructions may result in removal without refund.',
      'Unauthorized audio or video recordings of any part of the event are strictly prohibited without prior written consent from TEDx IIT Tirupati.',
    ],
  },
  {
    num: '05',
    title: 'Liability',
    body: [
      'TEDx IIT Tirupati and its organizers, volunteers, and affiliated institutions accept no liability for personal injury, loss of property, or any damages incurred during or in connection with the event.',
      'Attendees participate at their own risk. We recommend taking reasonable precautions to safeguard personal belongings.',
    ],
  },
  {
    num: '06',
    title: 'Updates to These Terms',
    body: [
      'These terms are subject to change at any time without prior notice. Any updates will be reflected on this page with a revised effective date.',
      'Continued use of the website or attendance at the event constitutes your acceptance of the most current version of these terms.',
    ],
  },
];

const tedSections = [
  {
    num: 'I',
    title: "TED's Role",
    body: [
      "By visiting or accessing any TED platform — including TED.com, TED applications, TED Connect, and TED Live — you agree to be bound by TED's Terms and Conditions, Privacy Policy, and Community Guidelines. You must be at least 13 years old to create a TED account.",
      'TED sites may contain links to third-party providers. TED is not responsible for or liable to any third-party sites. Please review the terms of use for third-party sites before accessing their content.',
    ],
  },
  {
    num: 'II',
    title: 'Interacting with TED Platforms',
    body: [
      'If you create a TED account, you must provide complete and accurate information. You must be at least 13 years old, or 16 years old if you are from the EU. You are responsible for keeping your account credentials confidential.',
      'By posting content on TED sites, you agree not to infringe on any third-party rights, including intellectual property rights. TED may use your posted content globally without requiring additional consent, and may edit it provided the original meaning is preserved.',
    ],
  },
  {
    num: 'III',
    title: 'Copyright & Licences',
    body: [
      'If you believe content on TED sites infringes your copyright, you may submit a DMCA (Digital Millennium Copyright Act) notice to TED directly.',
      'TED Talks and all TED content are protected by copyright and are available under a Creative Commons licence for personal and educational use only. Redistribution or modification without TED\'s explicit authorisation is prohibited.',
    ],
  },
  {
    num: 'IV',
    title: 'Legal Responsibilities',
    body: [
      'You are responsible for reviewing and adhering to all applicable terms when interacting with TED sites and using TED content.',
      'Misuse of TED platforms — including the unauthorized distribution of TED content — will result in penalties as determined by TED at its sole discretion.',
    ],
  },
];

export default function TnC() {
  useTCReveal();

  return (
    <div className="tc-page">

      {/* ── Header ── */}
      <header className="tc-header">
        <div className="tc-header__bg" />
        <div className="tc-header__inner">
          <span className="tc-eyebrow">Legal</span>
          <h1 className="tc-title">Terms &amp; <em>Conditions</em></h1>
          <div className="tc-rule">
            <span /><i /><span />
          </div>
          <p className="tc-tagline">Effective — March 2026</p>
        </div>
      </header>

      {/* ── Intro ── */}
      <div className="tc-intro-wrap tc-reveal">
        <div className="tc-intro">
          <p className="tc-intro__text">
            By accessing this website, purchasing tickets, or attending TEDx IIT Tirupati,
            you agree to the following terms and conditions. Please read them carefully
            before proceeding.
          </p>
        </div>
      </div>

      {/* ── TEDx IIT Tirupati Terms ── */}
      <div className="tc-sections">
        

        {tedxSections.map((sec, i) => (
          <div
            key={sec.num}
            className={`tc-section tc-reveal${i % 2 === 1 ? ' tc-reveal-d1' : ''}`}
          >
            <div className="tc-section__divider" />
            <div className="tc-section__inner">
              <div className="tc-section__meta">
                <span className="tc-chip">{sec.num}</span>
                <h2 className="tc-sec-heading">{sec.title}</h2>
              </div>
              <div className="tc-section__body">
                {sec.body.map((para, j) => (
                  <p key={j} className="tc-body">{para}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── TED Terms separator ── */}
      <div className="tc-separator tc-reveal">
        <div className="tc-separator__line" />
        <span className="tc-separator__label">TED Terms of Use</span>
        <div className="tc-separator__line" />
      </div>

      {/* ── TED Terms ── */}
      <div className="tc-sections tc-sections--ted">
        <div className="tc-block-label tc-reveal">
          <span className="tc-chip tc-chip--red">TED</span>
          <h2 className="tc-block-heading">TED Platform <em>Terms</em></h2>
        </div>
        <p className="tc-ted-note tc-reveal">
          The following terms govern your use of TED platforms globally. Last updated — March 2026.
        </p>

        {tedSections.map((sec, i) => (
          <div
            key={sec.num}
            className={`tc-section tc-reveal${i % 2 === 1 ? ' tc-reveal-d1' : ''}`}
          >
            <div className="tc-section__divider" />
            <div className="tc-section__inner">
              <div className="tc-section__meta">
                <span className="tc-chip tc-chip--roman">{sec.num}</span>
                <h2 className="tc-sec-heading">{sec.title}</h2>
              </div>
              <div className="tc-section__body">
                {sec.body.map((para, j) => (
                  <p key={j} className="tc-body">{para}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Contact CTA ── */}
      <section className="tc-contact tc-reveal">
        <div className="tc-contact__glow" />
        <span className="tc-chip">Contact</span>
        <h2 className="tc-contact__heading">
          Questions about these <em>Terms?</em>
        </h2>
        <p className="tc-body tc-contact__body">
          If you have any questions or concerns about these terms, please reach out to us.
          We aim to respond within 48 hours.
        </p>
        <div className="tc-contact__details">
          <a href="mailto:ted@iittp.ac.in" className="tc-contact__link">
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
          <span className="tc-contact__sep">·</span>
          <span className="tc-contact__addr">
            ECell Office, TIH Building, 2nd Floor, IIT Tirupati, Yepedu,
            Andhra Pradesh — 517619
          </span>
        </div>
      </section>

    </div>
  );
}