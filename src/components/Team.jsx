import { useState, useEffect, useRef } from "react";
import "./Team.css";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary helper — injects optimised params (w=400, auto quality & format)
// f_auto handles .heic conversion automatically in the browser
// ─────────────────────────────────────────────────────────────────────────────
const cl = (path) =>
  `https://res.cloudinary.com/dd1g028yx/image/upload/w_400,q_auto,f_auto/${path}`;

// ═════════════════════════════════════════════════════════════════════════════
// ✏️  EDIT TEAM DATA HERE
//     • Change name / role / img per member
//     • Set img: null  →  shows initials placeholder
//     • Reorder members within a group freely
//     • Add a new group object to add a new section
// ═════════════════════════════════════════════════════════════════════════════
export const TEAM_DATA = [
  // ── 01 · ORGANISERS ────────────────────────────────────────────────────────
  {
    group: "Organisers",
    tagline: "The vision behind it all",
    members: [
        {
        name: "Ritvik Ravi",
        role: "Co-organiser",
        img: null, // placeholder — replace with image URL when available
      },
      {
        name: "Kevin Prashan",
        role: "Co-organiser",
        img: cl("v1774680468/Kevin_Prashan___Co-organizer_f7kktg.jpg"),
      },
      
    ],
  },

  // ── 02 · TECHNICAL DIRECTION ───────────────────────────────────────────────
  {
    group: "Technical Direction",
    tagline: "Engineering the experience",
    members: [
      {
        name: "Satyam Kumar",
        role: "Technical Direction",
        img: cl("v1774681650/Satyam_Kumar_Technical_Direction_q2cice.jpg"),
      },
      {
        name: "Niharika",
        role: "Technical Direction",
        img: cl("v1774680470/Niharika_TechnicalDirection_xkznsq.jpg"),
      },
      {
        name: "Chirag Nahar",
        role: "Technical Direction",
        img: cl("v1774680477/CHIRAG_NAHAR_TECHNICALDIRECTION_mnlouv.jpg"),
      },
      {
        name: "Dharmesh",
        role: "Technical Direction",
        img: cl("v1774680474/Dharmesh_TechnicalDirection_su0ol6.jpg"),
      },
    ],
  },

  // ── 03 · DIGITAL EXPERIENCE (DX) ───────────────────────────────────────────
  {
    group: "Digital Experience",
    tagline: "Crafting the digital soul",
    members: [
      {
        name: "Stany",
        role: "Digital Experience",
        img: cl("v1774680488/Stany_DX_h6tv6h.png"),
      },
      {
        name: "Tanvi Velmala",
        role: "Digital Experience",
        img: cl("v1774680468/Tanvi_Velmala_DX_htkmne.heic"),
      },
      {
        name: "Devotio",
        role: "Digital Experience",
        img: cl("v1774680485/Devotio_DX_mvvzlu.jpg"),
      },
      {
        name: "Divino Adorat",
        role: "Digital Experience",
        img: cl("v1774680484/DivinoAdorat_DX_rlimm4.jpg"),
      },
    ],
  },

  // ── 04 · BRAND VISION ──────────────────────────────────────────────────────
  {
    group: "Brand Vision",
    tagline: "Shaping the identity",
    members: [
      {
        name: "Lakshay Dhyani",
        role: "Brand Vision",
        img: cl("v1774680484/LakshayDhyani_BrandVision_w9qghn.png"),
      },
      {
        name: "Mritunjay Tiwari",
        role: "Brand Vision",
        img: cl("v1774680483/MritunjayTiwari_BrandVision_tavxxw.jpg"),
      },
      {
        name: "Arsh Agarwal",
        role: "Brand Vision",
        img: cl("v1774680484/ARSH_AGARWAL_BRAND_VISION_o6stri.jpg"),
      },
    ],
  },

  // ── 05 · EVENT OPERATIONS ──────────────────────────────────────────────────
  {
    group: "Event Operations",
    tagline: "Orchestrating every moment",
    members: [
      {
        name: "Sridharshan",
        role: "Event Operations",
        img: cl("v1774680482/Sridharshan_EventOperations_orbb0r.png"),
      },
      {
        name: "Pratik Raj",
        role: "Event Operations",
        img: cl("v1774680473/Pratik_Raj_Operations_ikm1sb.webp"),
      },
      {
        name: "Utkarsh",
        role: "Event Operations",
        img: cl("v1774680485/Utkarsh_Events_ipgbew.jpg"),
      },
      {
        name: "Anushka",
        role: "Event Operations",
        img: cl("v1774680473/ANUSHKA_EVENTOPERATIONS_wp9gxf.webp"),
      },
      {
        name: "Umang Rastogi",
        role: "Event Operations",
        img: cl("v1774680480/Umang_Rastogi__Events_mrtthb.jpg"),
      },
      {
        name: "Shivam",
        role: "Event Operations",
        img: cl("v1774680478/Shivam_eventOperation_f2qh9s.jpg"),
      },
      {
        name: "Rinsha Narayanan",
        role: "Event Operations",
        img: cl("v1774680469/Rinsha_Narayanan_Events-Operations_zlvv3o.jpg"),
      },
      {
        name: "Arjit",
        role: "Event Operations",
        img: cl("v1774680469/Arjit_EventOperations_yms0vo.jpg"),
      },
    ],
  },

  // ── 06 · CURATION ──────────────────────────────────────────────────────────
  {
    group: "Curation",
    tagline: "Handpicking ideas worth spreading",
    members: [
      {
        name: "Pranav",
        role: "Curation",
        img: cl("v1774684030/pranav_curation_osyel5.jpg"),
      },
      {
        name: "Vishwa Sourya",
        role: "Curation",
        img: cl("v1774680481/Vishwa_Sourya_Curation_whaxtg.jpg"),
      },
      {
        name: "Subalaxmi N.B.",
        role: "Curation",
        img: cl("v1774680468/Subalaxmi_NB_Curation_odshwf.jpg"),
      },
      {
        name: "Jonell Samara",
        role: "Curation",
        img: cl("v1774680469/Jonell_Samara_Curation_Team_xhhmo3.jpg"),
      },
      {
        name: "Vedarsh",
        role: "Curation",
        img: cl("v1774680468/Vedarsh_Curation_ehc2wm.jpg"),
      },
      {
        name: "Shruti Singh",
        role: "Curation",
        img: cl("v1774680471/Shruti_Singh_Curation_fdrczu.jpg"),
      },
      {
        name: "Dharani",
        role: "Curation",
        img: cl("v1774680479/Dharani_Curation_qrdzbz.jpg"),
      },
      {
        name: "Hema",
        role: "Curation",
        img: cl("v1774680475/Hema_Curation_ylgb19.jpg"),
      },
    ],
  },

  // ── 07 · PARTNERSHIP ───────────────────────────────────────────────────────
  {
    group: "Partnership",
    tagline: "Building bridges, creating impact",
    members: [
      {
        name: "Soham Bhagwat",
        role: "Partnership & Finance",
        img: cl("v1774680480/Soham_Bhagwat_Partnerships_Finance_gpqmcy.jpg"),
      },
      {
        name: "Sashank",
        role: "Partnership",
        img: cl("v1774680475/Sashank_partnership_zdjpv5.png"),
      },
      {
        name: "Bhuvan",
        role: "Partnership",
        img: cl("v1774680475/Bhuvan_Partnership_j8zqo5.jpg"),
      },
      {
        name: "Rithul",
        role: "Partnership",
        img: cl("v1774680470/Rithul_Partnership_rtzvt2.jpg"),
      },
      {
        name: "M. Pramod",
        role: "Partnership",
        img: cl("v1774680479/M_Pramod_Partnership_cffg0a.jpg"),
      },
    ],
  },
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

// ─────────────────────────────────────────────────────────────────────────────
// LAZY IMAGE — IntersectionObserver + fade-in + error → initials fallback
// ─────────────────────────────────────────────────────────────────────────────
function LazyImage({ src, alt, name }) {
  const [visible, setVisible]   = useState(false);
  const [loaded,  setLoaded]    = useState(false);
  const [errored, setErrored]   = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }   // pre-load 400 px before entering viewport
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (errored) {
    return (
      <div className="tc-initials">
        <span>{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="tc-img-wrap">
      {visible && (
        <img
          src={src}
          alt={alt}
          className={`tc-img${loaded ? " tc-img--on" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          decoding="async"
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM CARD
// ─────────────────────────────────────────────────────────────────────────────
function TeamCard({ member }) {
  return (
    <div className="team-card">
      {member.img ? (
        <LazyImage src={member.img} alt={member.name} name={member.name} />
      ) : (
        <div className="tc-initials">
          <span>{getInitials(member.name)}</span>
        </div>
      )}

      <div className="tc-base">
        <div className="tc-name">{member.name}</div>
        <div className="tc-role">{member.role}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP BLOCK — mirrors YearBlock structure from Rewind
// ─────────────────────────────────────────────────────────────────────────────
function GroupBlock({ data, index }) {
  return (
    <div className="tg-block">
      <div className="tg-header">
        <div className="tg-left">
          <span className="tg-num">{String(index + 1).padStart(2, "0")}</span>
          <div className="tg-meta">
            <span className="tg-tagline">{data.tagline}</span>
            <span className="tg-name">{data.group}</span>
          </div>
        </div>
      </div>

      <div className="team-panel">
        {data.members.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Team() {
  return (
    <>
      {/* ── Header ── */}
      <header className="team-header">
        <div className="team-header__bg" />
        <div className="team-header__inner">
          <span className="team-eyebrow">The People Behind the Ideas</span>
          <h1 className="team-title">
            <em>Our Team</em>
          </h1>
          <div className="team-rule">
            <span />
            <i />
            <span />
          </div>
          <p className="team-tagline">Driven by passion. United by purpose.</p>
        </div>
      </header>

      {/* ── Group timeline ── */}
      <div className="team-timeline">
        {TEAM_DATA.map((group, i) => (
          <GroupBlock key={group.group} data={group} index={i} />
        ))}

        {/* Footer rule */}
        <div className="team-footer-rule">
          <div className="tfr-line" />
          <span className="tfr-text">TEDxIITTirupati · 2026</span>
          <div className="tfr-line" />
        </div>
      </div>
    </>
  );
}