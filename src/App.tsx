import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import URLShortener from "./components/URLShortener";
import { useScrollToTopOnRouteChange } from "./lib/utils";
import { useTheme } from "./lib/theme-provider";
import { useEffect, useState } from "react";

export default function App() {
  useScrollToTopOnRouteChange();
  const { theme, themeTransitioning } = useTheme();
  const [showDarkEffects, setShowDarkEffects] = useState(theme === "dark");

  useEffect(() => {
    if (theme === "dark") {
      setShowDarkEffects(true);
    } else {
      // Delay hiding effects to allow fade-out
      const timeout = setTimeout(() => setShowDarkEffects(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [theme]);

  if (themeTransitioning) {
    return (
      <div className="fixed inset-0 bg-background z-[9999] transition-colors duration-300"></div>
    );
  }

  return (
    <div className="zaplink-bg">
      <div
        className={`transition-opacity ${
          theme === "dark" && showDarkEffects
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ position: "fixed", inset: 0, zIndex: 1 }}
      >
        <div className="radial-spot"></div>
        <div
          className="glow-blob blue"
          style={{
            top: "-12rem",
            left: "-12rem",
            width: "600px",
            height: "600px",
          }}
        ></div>
        <div
          className="glow-blob purple"
          style={{
            bottom: "-10rem",
            right: "-10rem",
            width: "700px",
            height: "700px",
          }}
        ></div>
        <div className="noise-overlay"></div>
      </div>
      <div className="relative z-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/upload" element={<UploadPage />}></Route>
          <Route path="/customize" element={<Customize />}></Route>
          <Route path="/how-it-works" element={<HowItWorks />}></Route>
          <Route path="/about" element={<AboutUs />}></Route>
          <Route path="/zaps/:shortId" element={<ViewZap />} />
          <Route path="/shorten" element={<URLShortener />} />
        </Routes>
        <Analytics />
      </div>
    </div>
  );
}
