import { useState } from "react";
import "./Rewind.css";
import a from "../assets/rewind-2025/1.png";
import b from "../assets/rewind-2025/2.png";
import c from "../assets/rewind-2025/3.png";
import d from "../assets/rewind-2025/4.png";
import e from "../assets/rewind-2025/5.png";

// ── DATA ─────────────────────────────────────────────────────────────────────
const EDITIONS = [
  {
    year: 2025,
    theme: "Symphonies of Serendipity",
    speakers: [
      {
        name: "Dr. Tanu Jain",
        tag: "Civil Services · Philosophy & Ethics",
        bio: "Dr. Tanu Jain holds a Bachelor of Dentistry degree from Subharti College and successfully cleared the Civil Services examination in 2014. She resigned from her professional position to establish the Tathastu Institute of Civil Services, where she teaches philosophy and ethics. Renowned for her motivational speaking and mock interview sessions, she actively engages with social organisations with a mission to cultivate individuals of strong character dedicated to family, society, and the nation.",
        img: a,
      },
      {
        name: "Dr. Maral Yazarloo",
        tag: "World Record Holder · Women's Rights Advocate",
        bio: "Dr. Maral Yazarloo-Pattrick is an Iran-born motor-biking world record holder, fashion designer, artist, and campaigner for women's rights. She holds the record for the highest mileage on a superbike for ladies — over 2,50,000 km — earning her the title 'Queen of Superbikes of India'. Recognised among BBC's Top 100 Inspiring and Influential Women, she has captivated audiences at TEDx, the Retail Forum in Las Vegas, LFS Conclave in India, and Virginia Commonwealth University of Qatar.",
        img: b,
      },
      {
        name: "Dr. Dhruv Chauhan",
        tag: "Physician · Medical Rights Advocate",
        bio: "Dr. Dhruv Chauhan, a 27-year-old physician, worked with Delhi State Cancer Institute and serves as National Coordinator of the Indian Medical Association and founder of the Legal Cell for All India Doctors. A prominent voice amid India's higher-education exam controversies, he collaborates with peers to seek accountability and reform, providing assurance and advocacy for young medical aspirants navigating a turbulent system.",
        img: c,
      },
      {
        name: "Mr. Shiv Vats",
        tag: "Educator · EnglishWaleSir",
        bio: "Mr. Shiv Vats, popularly known as EnglishWaleSir, is a visionary educator and digital content creator whose unique teaching style has revolutionised the learning experience. Beyond language instruction, he fosters critical thinking, confidence, and a love for learning through engaging, relatable storytelling. His commitment to redefining traditional teaching has earned him a massive following across social media, making him a mentor to students from all walks of life.",
        img: d,
      },
      {
        name: "Mr. Piyush Somani",
        tag: "Entrepreneur · Founder, ESDS Software",
        bio: "A visionary and born leader, Mr. Piyush Somani founded ESDS Software Solution at 23 with a mission to build an organisation where respect for the company always transcends self-interest. With a workforce of nearly 1,000+ employees across domestic and international offices, he personally connects with each team member. A first-generation entrepreneur featured in Forbes, The Economic Times, Times of India, and Business Insider.",
        img: e,
      },
    ],
  },
  // ── Add future editions here, newest first ───────────────────────────────
  // {
  //   year: 2026,
  //   theme: "Theme Name",
  //   speakers: [ ... ],
  // },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function getInitials(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── SPEAKER CARD ─────────────────────────────────────────────────────────────
function SpeakerCard({ speaker, onBioOpen }) {
  return (
    <div className="speaker-card" onClick={() => onBioOpen(speaker)}>
      {speaker.img ? (
        <img className="card-photo" src={speaker.img} alt={speaker.name} />
      ) : (
        <div className="card-initials">
          <span>{getInitials(speaker.name)}</span>
        </div>
      )}
      <div className="card-base">
        <div className="card-name">{speaker.name}</div>
        <div className="card-tag">{speaker.tag}</div>
      </div>
      <div className="card-hint">tap to read more</div>
    </div>
  );
}

// ── BIO MODAL ────────────────────────────────────────────────────────────────
function BioModal({ speaker, onClose }) {
  if (!speaker) return null;
  return (
    <div className="bio-modal-backdrop" onClick={onClose}>
      <div className="bio-modal" onClick={(e) => e.stopPropagation()}>
        <button className="bio-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="bio-modal-inner">
          <div className="bio-modal-photo-wrap">
            {speaker.img ? (
              <img
                className="bio-modal-photo"
                src={speaker.img}
                alt={speaker.name}
              />
            ) : (
              <div className="bio-modal-initials">
                <span>{getInitials(speaker.name)}</span>
              </div>
            )}
          </div>
          <div className="bio-modal-text-wrap">
            <div className="bio-modal-red-line" />
            <h2 className="bio-modal-name">{speaker.name}</h2>
            <p className="bio-modal-tag">{speaker.tag}</p>
            <p className="bio-modal-bio">{speaker.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── YEAR BLOCK ───────────────────────────────────────────────────────────────
function YearBlock({ edition, editionNumber, onBioOpen }) {
  return (
    <div className="year-block">
      <div className="year-header">
        <div className="year-left">
          <span className="year-num">{edition.year}</span>
          <div className="year-meta">
            <span className="year-edition-label">
              Edition {String(editionNumber).padStart(2, "0")}
            </span>
            <span className="year-theme">{edition.theme}</span>
          </div>
        </div>
      </div>

      <div className="speakers-panel">
        {edition.speakers.map((sp) => (
          <SpeakerCard key={sp.name} speaker={sp} onBioOpen={onBioOpen} />
        ))}
      </div>
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function Rewind() {
  const [activeSpeaker, setActiveSpeaker] = useState(null);

  return (
    <>
      {/* Slim page header */}
      <div className="rewind-page-header">
        <div className="rewind-header-left">
          <span className="rewind-label-red">TEDx</span>
          <span className="rewind-label-white">IITTirupati</span>
          <span className="rewind-slash">/</span>
          <span className="rewind-label-page">Rewind</span>
        </div>
        <p className="rewind-header-sub">
          <em>Every edition, preserved.</em>
        </p>
      </div>

      {/* Timeline */}
      <div className="timeline">
        {EDITIONS.map((ed, i) => (
          <YearBlock
            key={ed.year}
            edition={ed}
            editionNumber={i + 1}
            onBioOpen={setActiveSpeaker}
          />
        ))}

        {/* Future teaser */}
        <div className="future-teaser">
          <div className="future-line" />
          <span className="future-text">More editions to come</span>
          <div className="future-line" />
        </div>
      </div>

      {/* Bio modal */}
      <BioModal
        speaker={activeSpeaker}
        onClose={() => setActiveSpeaker(null)}
      />
    </>
  );
}