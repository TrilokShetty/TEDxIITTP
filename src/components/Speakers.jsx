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
//   4. Set `linkedin: null` to hide the LinkedIn button for that speaker.
//
// ── APPEND NEW SPEAKERS BELOW THIS LINE ──────────────────────────────────────


import kajal from "../assets/speakers/Kajal_Singh.jpeg";
import vivek from "../assets/speakers/vivek_atray.jpeg";
import joshiba from "../assets/speakers/Joshiba.jpeg";
import srikant from "../assets/speakers/Srikant.jpeg";
import sanjana from "../assets/speakers/sanjana.jpeg";
import rajev  from "../assets/speakers/Rajeev.jpeg";


const SPEAKERS = [
  {
    id: 1,
    revealed: true,
    name: "Dr. Kajal Singh",
    tag: "Public Health · Preventive Healthcare · Community Awareness",
    instagram: "https://www.instagram.com/drkajalsinghh/",
    linkedin: "https://www.linkedin.com/in/drkajalsinghh/", 
    bio: "Dr. Kajal Singh is a medical professional and public health advocate committed to improving healthcare awareness and accessibility. Her work lies at the intersection of clinical practice and preventive healthcare, focusing on educating communities about health risks, early intervention, and lifestyle changes. She represents a new generation of healthcare professionals who go beyond hospitals to engage directly with the public, emphasizing that awareness is often the first step toward better health outcomes.",
    img: kajal,
  },
  {
    id: 2,
    revealed: true,
    name: "Mr. Vivek Atray",
    tag: "Civil Services · Leadership · Personal Development",
    instagram: "https://www.instagram.com/vivekatray/",
    linkedin: "https://www.linkedin.com/in/vivek-atray-9464434/", 
    bio: "Mr. Vivek Atray is a former IAS officer turned author, speaker, and leadership mentor, known for his impactful work in governance and personal development. During his tenure in the civil services, he held several key administrative roles, contributing to policy-making and public administration. After leaving the IAS, he transitioned into writing and public speaking, where he focuses on life design, leadership, and inner growth. His books and talks emphasize clarity, purpose, and the power of conscious decision-making. Mr. Atray brings a rare blend of bureaucratic experience and philosophical insight, making his perspectives both practical and deeply reflective.",
    img: vivek,
  },
  {
    id: 3,
    revealed: true,
    name: "Ms. Joshiba Dev",
    tag: "Legal Education · Financial Literacy · Legal Awareness",
    instagram: "https://www.instagram.com/legallyfitjoshiba/",
    linkedin: "https://www.linkedin.com/in/adv-joshiba-dev/", 
    bio: "Joshiba Dev is a legal educator and founder of Legally Fit, a platform dedicated to making legal and financial literacy accessible to all. Through her digital content, she simplifies complex legal concepts and empowers individuals to understand their rights and responsibilities. Her work focuses on bridging the gap between law and everyday life.",
    img: joshiba,
  },
  {
    id: 4,
    revealed: true,
    name: "Mr. Shrikant Madhav Vaidya",
    tag: "Energy Sector · Oil & Gas · Leadership · Sustainability",
    instagram: null,
    linkedin: "https://www.linkedin.com/in/shrikant-m-vaidya/",
    bio: "Shrikant Madhav Vaidya is a distinguished leader in India’s energy sector, having served as the Chairman of Indian Oil Corporation, one of the country’s largest public sector enterprises. With decades of experience in oil, gas, and energy infrastructure, he has been instrumental in steering large-scale operations and navigating the evolving landscape of energy demands. His leadership reflects a strong focus on sustainability, energy transition, and innovation within traditional industries. Vaidya’s journey exemplifies how legacy industries can adapt to global challenges while continuing to drive national growth.",
    img: srikant,
  },
  {
    id: 5,
    revealed: true,
    name: "Ms. Sanjana Sarathy",
    tag: "Acting · Entrepreneurship · Content Creation",
    instagram: "https://www.instagram.com/sanjana.sarathy/",
    linkedin: null,
    bio: "An actor who began her journey in Tamil cinema, Sanjana gained wider recognition for her role in Mismatched. She is steadily carving her space across industries, working toward becoming a pan-India actor and creator. Known for her expressive screen presence, she brings honesty and depth to her characters while continuously evolving in her craft. Beyond acting, she is also exploring content creation and entrepreneurship, while using her platform to contribute to meaningful causes.",
    img: sanjana,
  },
  {
    id: 6,
    revealed: true,
    name: "Mr. Rajev B Sharma ",
    tag: "Global Career Strategist · Academic Mentor · Entrepreneur",
    instagram: "https://www.instagram.com/rajevb/",
    linkedin: "https://in.linkedin.com/in/rajevbsharma",
    bio: "Dr. Rajev B. Sharma is a Global Career Strategist, academic mentor, and entrepreneur with over 20 years of CXO experience across education, finance, and HR. An engineer, MBA, and DLitt, he has mentored thousands of students and young professionals in designing future-ready careers. As the founder of TASA Global and multiple career & education platforms, his work focuses on one powerful idea: Careers are not meant to be chosen once - they are meant to be designed and evolved.",
    img: rajev,
  },
  // ── PASTE NEW SPEAKERS BELOW THIS COMMENT ────────────────────────────────
  // {
  //   id: 6,
  //   revealed: false,      //    ← set to true once ready to reveal
  //   name: "Speaker Name",
  //   tag: "Role · Affiliation",
  //   instagram: "https://www.instagram.com/handle/",
  //   linkedin: "https://www.linkedin.com/in/handle/",  // ← or null to hide
  //   bio: "Bio text goes here.",
  //   img: photoF,          //    ← import the photo at the top of the file
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

function LinkedInIcon() {
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
      <rect x="2" y="2" width="20" height="20" rx="3" ry="3" />
      <line x1="8" y1="11" x2="8" y2="16" />
      <line x1="8" y1="8" x2="8" y2="8.01" strokeWidth="2" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 0 0-4 0" />
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
          {/* Instagram */}
          {speaker.instagram && (
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
              <span>Instagram</span>
            </a>
          )}

          {/* LinkedIn — only rendered when a URL is provided */}
          {speaker.linkedin && (
            <a
              className="sp-linkedin-btn"
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${speaker.name} on LinkedIn`}
            >
              <span className="sp-insta-icon">
                <LinkedInIcon />
              </span>
              <span>LinkedIn</span>
            </a>
          )}
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
        {/* <div className="sp-footer-ornament">
          <div className="sp-footer-line" />
          <span className="sp-footer-text">More announcements on the way</span>
          <div className="sp-footer-line" />
        </div> */}
      </main>
    </>
  );
}