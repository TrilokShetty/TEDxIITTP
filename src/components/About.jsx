import { useEffect } from 'react';
import './About.css';

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function WaveSVG() {
  return (
    <svg className="abt-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i}
          d={`M0,${40 + i * 6} C360,${15 + i * 5} 720,${65 + i * 4} 1080,${28 + i * 6} C1260,${12 + i * 4} 1380,${55 + i * 3} 1440,${38 + i * 5}`}
          fill="none"
          stroke={i % 2 === 0 ? '#eb0028' : 'var(--gold)'}
          strokeWidth="0.9"
          opacity={0.55 - i * 0.08}
        />
      ))}
    </svg>
  );
}

export default function AboutPage() {
  useReveal();

  return (
    <div className="about-page">

      {/* ── Header ── */}
      <header className="abt-header">
        <div className="abt-header__bg" />
        <div className="abt-header__inner">
          <span className="abt-eyebrow">Discover</span>
          <h1 className="abt-title">About <em>Us</em></h1>
          <div className="abt-rule">
            <span /><i /><span />
          </div>
          <p className="abt-tagline">Ideas Worth Spreading</p>
        </div>
      </header>

      {/* ── Intro ── */}
      <div className="abt-intro-wrap reveal">
        <div className="abt-intro">
          <p className="abt-intro__text">
            Welcome to the official website of TEDx IIT Tirupati. We are a community 
            dedicated to discovering and sharing ideas that spark deep discussion and 
            meaningful connection. Learn more about our mission, our approach, and 
            the vision that drives our event.
          </p>
        </div>
      </div>

      {/* ── 01 WHO WE ARE ──────────────────────────────────── */}
      <section className="abt-section">
        <div className="abt-row reveal">
          <div className="abt-row__label">
            <span className="chip">01</span>
            <h2 className="sec-heading">Who We <em>Are</em></h2>
          </div>
          <div className="abt-row__body">
            <p className="body-text">
              TEDxIIT Tirupati is an independently organized TEDx event hosted by the vibrant
              student community of IIT Tirupati. Our event is designed to spark conversations
              and inspire action by bringing together some of the most innovative minds and
              thought leaders from diverse fields.
            </p>
          </div>
        </div>
      </section>

      

      <div className="divider-line" />

      {/* ── 02 VISION ──────────────────────────────────────── */}
      <section className="abt-section">
        <div className="abt-row reveal">
          <div className="abt-row__label">
            <span className="chip">02</span>
            <h2 className="sec-heading">Our <em>Vision</em></h2>
          </div>
          <div className="abt-row__body">
            <p className="body-text">
              We envision a space where groundbreaking thoughts are shared, creativity is
              celebrated, and intellectual engagement flourishes. Every voice matters, and
              every idea has the potential to spark transformation.
            </p>
            <p className="body-text">
              Our vision is to foster collaboration and build a community where people from
              diverse backgrounds can come together to exchange knowledge, challenge norms,
              and inspire innovation. We aim to ignite curiosity by encouraging individuals
              to think beyond conventional boundaries and explore new perspectives.
            </p>
          </div>
        </div>
      </section>

      <div className="divider-line" />

      {/* ── 03 APPROACH ────────────────────────────────────── */}
      <section className="abt-section">
        <div className="sec-intro reveal">
          <span className="chip">03</span>
          <h2 className="sec-heading">Our <em>Approach</em></h2>
        </div>

        <div className="approach-grid">
          <div className="approach-item reveal">
            <div className="approach-item__num">A</div>
            <div>
              <h3 className="approach-item__title">Excellence in Every Detail</h3>
              <p className="body-text">
                At TEDxIIT Tirupati, our commitment to excellence drives every aspect of the
                event. Each element is carefully crafted to deliver a memorable and impactful
                experience for both our speakers and audience.
              </p>
            </div>
          </div>

          <div className="approach-item reveal reveal-d1">
            <div className="approach-item__num">B</div>
            <div>
              <h3 className="approach-item__title">Curated & Authentic</h3>
              <p className="body-text">
                Our speaker lineup is thoughtfully curated to ensure a diverse range of voices,
                ideas, and perspectives. We prioritize quality, relevance, and authenticity to
                create a balanced and thought-provoking program. From captivating stage designs
                to interactive exhibits and performances, we engage all senses.
              </p>
            </div>
          </div>

          <div className="approach-item reveal reveal-d2">
            <div className="approach-item__num">C</div>
            <div>
              <h3 className="approach-item__title">Seamless Execution</h3>
              <p className="body-text">
                Behind the scenes, our dedicated teams work tirelessly to manage production,
                logistics, sponsorships, and marketing to ensure the event is executed
                seamlessly. By combining passion, creativity, and attention to detail, we strive
                to make TEDxIIT Tirupati an unforgettable experience for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-line" />

      {/* ── JOIN US ─────────────────────────────────────────── */}
      <section className="abt-cta">
        <div className="abt-cta__glow" />
        <span className="chip reveal">Join Us</span>
        <h2 className="cta-heading reveal reveal-d1">
          Be Part of the <em>Journey</em>
        </h2>
        <p className="body-text cta-body reveal reveal-d2">
          TEDxIIT Tirupati is a celebration of ideas, collaborations, and inspiration. It is
          a journey of discovery where groundbreaking concepts meet human stories, and
          creativity meets action.
        </p>
        <p className="body-text cta-body reveal reveal-d2">
          Join us as we explore the unexpected and celebrate the serendipitous connections
          that shape our world. Be a part of this transformative experience that promises to
          leave you inspired, motivated, and ready to make a difference. Whether as a
          speaker, sponsor, or attendee, your participation makes all the difference.
        </p>
        <a href="../contact" className="cta-btn reveal reveal-d3">Get Involved</a>
      </section>

    </div>
  );
}