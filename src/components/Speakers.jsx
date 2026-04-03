import { useState, useEffect } from "react";
import "./Speakers.css";

// ─────────────────────────────────────────────────────────────────────────────
// SPEAKER DATA
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD A NEW SPEAKER:
//   1. Import their photo at the top of this file, e.g.:
//        import photoSix from "../assets/speakers/6.png";
//   2. Copy one of the objects below, paste it at the END of the SPEAKERS array
//      (before the closing bracket `]`), and fill in the fields.
//   3. Set `revealed: false` to show the "Revealing Soon" card instead.
//
// ── APPEND NEW SPEAKERS BELOW THIS LINE ──────────────────────────────────────

import photoA from "../assets/rewind-2025/1.png";
import photoB from "../assets/rewind-2025/2.png";
import photoC from "../assets/rewind-2025/3.png";
import photoD from "../assets/rewind-2025/4.png";
import photoE from "../assets/rewind-2025/Kajal_Singh.jpeg";
import kajal from "../assets/speakers/Kajal_Singh.jpeg";

const SPEAKERS = [
  {
    id: 1,
    revealed: true,
    name: "Dr. Kajal Singh",
    tag: "Public Health · Preventive Healthcare · Community Awareness",
    instagram: "https://www.instagram.com/drkajalsinghh/", // ← replace with real handle
    bio: "Dr. Kajal Singh is a medical professional and public health advocate committed to improving healthcare awareness and accessibility. Her work lies at the intersection of clinical practice and preventive healthcare, focusing on educating communities about health risks, early intervention, and lifestyle changes. She represents a new generation of healthcare professionals who go beyond hospitals to engage directly with the public, emphasizing that awareness is often the first step toward better health outcomes.",
    img: photoE,
  },
  {
    id: 2,
    revealed: false,
    name: "Dr. Maral Yazarloo",
    tag: "World Record Holder · Women's Rights Advocate",
    instagram: "",
    bio: "Dr. Maral Yazarloo-Pattrick is an Iran-born motor-biking world record holder, fashion designer, artist, and campaigner for women's rights. She holds the record for the highest mileage on a superbike for ladies — over 2,50,000 km — earning her the title 'Queen of Superbikes of India'. Recognised among BBC's Top 100 Inspiring and Influential Women, she has captivated audiences at TEDx, the Retail Forum in Las Vegas, LFS Conclave in India, and Virginia Commonwealth University of Qatar.",
    img: photoB,
  },
  {
    id: 3,
    revealed: false,
    name: "Dr. Dhruv Chauhan",
    tag: "Physician · Medical Rights Advocate",
    instagram: "https://www.instagram.com/placeholder/",
    bio: "Dr. Dhruv Chauhan, a 27-year-old physician, worked with Delhi State Cancer Institute and serves as National Coordinator of the Indian Medical Association and founder of the Legal Cell for All India Doctors. A prominent voice amid India's higher-education exam controversies, he collaborates with peers to seek accountability and reform, providing assurance and advocacy for young medical aspirants navigating a turbulent system.",
    img: photoC,
  },
  {
    id: 4,
    revealed: false,
    name: "Mr. Shiv Vats",
    tag: "Educator · EnglishWaleSir",
    instagram: "https://www.instagram.com/placeholder/",
    bio: "Mr. Shiv Vats, popularly known as EnglishWaleSir, is a visionary educator and digital content creator whose unique teaching style has revolutionised the learning experience. Beyond language instruction, he fosters critical thinking, confidence, and a love for learning through engaging, relatable storytelling. His commitment to redefining traditional teaching has earned him a massive following across social media, making him a mentor to students from all walks of life.",
    img: photoD,
  },
  {
    id: 5,
    revealed: false,
    name: "Mr. Piyush Somani",
    tag: "Entrepreneur · Founder, ESDS Software",
    instagram: "https://www.instagram.com/placeholder/",
    bio: "A visionary and born leader, Mr. Piyush Somani founded ESDS Software Solution at 23 with a mission to build an organisation where respect for the company always transcends self-interest. With a workforce of nearly 1,000+ employees across domestic and international offices, he personally connects with each team member. A first-generation entrepreneur featured in Forbes, The Economic Times, Times of India, and Business Insider.",
    img: photoE,
  },
  {
    id: 5,
    revealed: false,
    name: "Mr. Piyush Somani",
    tag: "Entrepreneur · Founder, ESDS Software",
    instagram: "https://www.instagram.com/placeholder/",
    bio: "A visionary and born leader, Mr. Piyush Somani founded ESDS Software Solution at 23 with a mission to build an organisation where respect for the company always transcends self-interest. With a workforce of nearly 1,000+ employees across domestic and international offices, he personally connects with each team member. A first-generation entrepreneur featured in Forbes, The Economic Times, Times of India, and Business Insider.",
    img: photoE,
  },
  // ── PASTE NEW SPEAKERS BELOW THIS COMMENT ────────────────────────────────
  // {
  //   id: 6,
  //   revealed: false,          ← set to true once ready to reveal
  //   name: "Speaker Name",
  //   tag: "Role · Affiliation",
  //   instagram: "https://www.instagram.com/handle/",
  //   bio: "Bio text goes here.",
  //   img: photoF,              ← import the photo at the top of the file
  // },
  // ── END OF SPEAKER LIST ───────────────────────────────────────────────────
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getInitials(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEAKER ROW
// ─────────────────────────────────────────────────────────────────────────────
function SpeakerRow({ speaker, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(timer);
  }, [index]);

  if (!speaker.revealed) {
    return (
      <article
        className={`sp-row sp-row--hidden ${visible ? "sp-row--in" : ""}`}
        style={{ "--delay": `${index * 0.12}s` }}
      >
        <div className="sp-photo-wrap sp-photo-wrap--hidden">
          <div className="sp-initials-mask">
            <span className="sp-hidden-label">?</span>
          </div>
          <div className="sp-order-badge">{String(index + 1).padStart(2, "0")}</div>
        </div>

        <div className="sp-info">
          <p className="sp-eyebrow">Speaker Announcement</p>
          <h2 className="sp-name sp-name--hidden">Revealing Soon</h2>
          <div className="sp-divider" />
          <p className="sp-bio sp-bio--teaser">
            An inspiring mind is joining our stage. Stay tuned — this announcement
            is just around the corner. Follow us on Instagram for the reveal.
          </p>
          <div className="sp-actions sp-actions--hidden">
            <span className="sp-tag-pill">Coming Soon</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`sp-row ${visible ? "sp-row--in" : ""}`}
      style={{ "--delay": `${index * 0.12}s` }}
    >
      {/* Photo */}
      <div className="sp-photo-wrap">
        {speaker.img ? (
          <img
            className="sp-photo"
            src={speaker.img}
            alt={speaker.name}
          />
        ) : (
          <div className="sp-initials-mask">
            <span>{getInitials(speaker.name)}</span>
          </div>
        )}
        <div className="sp-order-badge">{String(index + 1).padStart(2, "0")}</div>
        <div className="sp-photo-frame" />
      </div>

      {/* Info */}
      <div className="sp-info">
        <p className="sp-eyebrow">{speaker.tag}</p>
        <h2 className="sp-name">{speaker.name}</h2>
        <div className="sp-divider" />
        <p className="sp-bio">{speaker.bio}</p>

        <div className="sp-actions">
          <a
            className="sp-insta-btn"
            href={speaker.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${speaker.name} on Instagram`}
          >
            <span className="sp-insta-icon">
              <InstagramIcon />
            </span>
            <span>Follow on Instagram</span>
          </a>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Speakers() {
  return (
    <>
      {/* ── Header ── */}
      <header className="sp-header">
        <div className="sp-header-bg" />
        <div className="sp-header-inner">
          <span className="sp-header-eyebrow">TEDx IIT Tirupati</span>
          <h1 className="sp-header-title">
            Meet the <em>Speakers</em>
          </h1>
          <div className="sp-header-rule">
            <span /><i /><span />
          </div>
          <p className="sp-header-sub">
            Voices that challenge, inspire, and endure.
          </p>
        </div>
      </header>

      {/* ── Speaker list ── */}
      <main className="sp-main">
        <div className="sp-list">
          {SPEAKERS.map((sp, i) => (
            <SpeakerRow key={sp.id} speaker={sp} index={i} />
          ))}
        </div>

        {/* Bottom ornament */}
        <div className="sp-footer-ornament">
          <div className="sp-footer-line" />
          <span className="sp-footer-text">More announcements on the way</span>
          <div className="sp-footer-line" />
        </div>
      </main>
    </>
  );
}