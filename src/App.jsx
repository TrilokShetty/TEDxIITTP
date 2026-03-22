import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { useMemo, useState } from "react";
import { useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import TedxLogo from "./components/TedxLogo";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ComingSoon from "./components/ComingSoon";
import Rewind from "./components/Rewind";
import Tickets from "./components/Tickets";
import About from "./components/About";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TnC";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".appRoot")?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}



gsap.registerPlugin(Observer);

const INTRO_SESSION_KEY = "introPlayed";

const AnimatedSections = () => {
  const initialShowIntro = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== "1";
  }, []);

  const [showTedxLogo, setShowTedxLogo] = useState(initialShowIntro);

  return (
    <div className="appRoot">
      {showTedxLogo ? (
        <div className="logoOverlay">
          <TedxLogo
            onComplete={() => {
              window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
              setShowTedxLogo(false);
            }}
          />
        </div>
      ) : (
        <>
          {/* Navbar always visible */}
          <Navbar />

          {/* ROUTES HERE */}
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/rewind" element={<Rewind />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>

          {/* Footer always visible */}
          <Footer />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedSections />
    </Router>
  );
}