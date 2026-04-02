import "./Sponsors.css";

// ── ASSETS ───────────────────────────────────────────────────────────────────
import visionPhoto from "../assets/Vision_Photography.jpeg";
import beautifulTirupati from "../assets/Beautiful_Tirupathi.jpeg";
import doonMerch from "../assets/Doon_Merchandise.png";
import srikesh from "../assets/Srikesh.png";

// ── DATA ─────────────────────────────────────────────────────────────────────

const SPONSORS = [
    { name: "Vision Photography", descriptor: "Photography Partner", logo: visionPhoto, url: "https://www.instagram.com/visionphotography_tirupati" },
    { name: "Beautiful Tirupathi", descriptor: "Social Media Partner", logo: beautifulTirupati, url: "https://www.instagram.com/beautifultirupathi" },
    { name: "Doon Merchandise", descriptor: "Clothing Partner", logo: doonMerch, url: "https://www.instagram.com/offiicial_doon" },
    { name: "Srikesh Infotech", descriptor: "Event Partner", logo: srikesh, url: "https://www.srikeshinfotech.com/" },

];

// ── HELPERS ──────────────────────────────────────────────────────────────────
function getAbbr(name) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

// ── SPONSOR ITEM ─────────────────────────────────────────────────────────────
function SponsorItem({ sponsor }) {
    return (
        <div className="sponsor-item">
            <a
                className="sponsor-card"
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={sponsor.name}
            >
                <div className="sponsor-card__logo-wrap">
                    {sponsor.logo ? (
                        <img
                            className="sponsor-card__logo-img"
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                        />
                    ) : (
                        <span className="sponsor-card__abbr">{getAbbr(sponsor.name)}</span>
                    )}
                </div>
            </a>

            <div className="sponsor-info">
                <span className="sponsor-info__name">{sponsor.name}</span>
                <span className="sponsor-info__descriptor">{sponsor.descriptor}</span>
            </div>
        </div>
    );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function Sponsors() {
    return (
        <>
            {/* Header — mirrors Rewind header exactly */}
            <header className="spn-header">
                <div className="spn-header__bg" />
                <div className="spn-header__inner">
                    <span className="spn-eyebrow">Our Patrons</span>
                    <h1 className="spn-title"><em>Sponsors</em></h1>
                    <div className="spn-rule">
                        <span /><i /><span />
                    </div>
                    <p className="spn-tagline">The visionaries who make ideas worth spreading.</p>
                </div>
            </header>

            {/* Sponsors grid */}
            <div className="sponsors-page">
                <div className="sponsors-grid">
                    {SPONSORS.map((sp) => (
                        <SponsorItem key={sp.name} sponsor={sp} />
                    ))}
                </div>

                {/* CTA */}
                <div className="spn-cta">
                    <div className="spn-cta__line" />
                    <div className="spn-cta__inner">
                        <p className="spn-cta__copy">
                            Interested in partnering with TEDx IIT Tirupati?
                        </p>
                        <a className="spn-cta__btn" href="mailto:ted@iittp.ac.in">
                            Get in Touch
                        </a>
                    </div>
                    <div className="spn-cta__line spn-cta__line--right" />
                </div>
            </div>
        </>
    );
}