import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-white.png"; // Adjust path if your Navbar is in a different directory
import "./Navbar.css";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Speakers", to: "/coming-soon" },
  { label: "About", to: "/about" },
  { label: "Rewind", to: "/rewind" },
  { label: "Sponsors", to: "/coming-soon" },
  { label: "Team", to: "/team" },
];

const NavLinkItem = ({ label, icon, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link className={`tedxNavLink ${isActive ? "isActive" : ""}`} to={to}>
      {icon && <span className="tedxNavLinkIcon">{icon}</span>}
      {label}
    </Link>
  );
};

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
        
        {/* Updated Logo Zone */}
        <div className="tedxNavbarLogo">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="tedxLogoWrapper">
            <img src={logo} alt="TEDx Logo" className="tedxLogoImg" />
            <div className="tedxSubline">
              <span className="tedxSubline-x" style={{color: "red"} }>x</span> = independently organized <span className="tedxSubline-red">TED</span> event
            </div>
          </Link>
        </div>

        <div className="tedxNavbarCenter">
          {NAV_ITEMS.map((item) => (
            <NavLinkItem key={item.label} {...item} />
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
            <Link 
              key={item.label} 
              to={item.to} 
              onClick={() => setMenuOpen(false)}
              className={window.location.pathname === item.to ? "isActive" : ""}
            >
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