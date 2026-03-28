import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TedxLogoText from "./TedxLogoText";
import "./Navbar.css";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Speakers", to: "/coming-soon" },
  { label: "About", to: "/about" },
  { label: "Rewind", to: "/rewind" },
  { label: "Sponsors", to: "/coming-soon" },
  { label: "Team", to: "/team" },
];

const NavLink = ({ label, icon, to }) => (
  <Link className="tedxNavLink" to={to}>
    <span className="tedxNavLinkIcon">{icon}</span>
    {label}
  </Link>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToFooter = (e) => {
    e.preventDefault();
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`tedxNavbar${scrolled ? " isScrolled" : ""}`}>

        <div className="tedxNavbarLogo">
          <TedxLogoText showTagline={true} />
        </div>

        <div className="tedxNavbarCenter">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>

        <div className="tedxNavbarRight">
          <a href="#footer" className="tedxNavContact" onClick={scrollToFooter}>
            <span className="tedxNavContactIcon">◎</span>
            Contact
          </a>
        </div>

        <button
          className="tedxNavBurger"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="tedxMobileMenu">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a href="#footer" onClick={scrollToFooter}>Contact</a>
        </div>
      )}
    </>
  );
};

export default Navbar;