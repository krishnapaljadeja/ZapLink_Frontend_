import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
import URLShortener from "./components/URLShortener";
import { Analytics } from "@vercel/analytics/react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/upload" element={<UploadPage />}></Route>
        <Route path="/url-shortener" element={<URLShortener />}></Route>
        <Route path="/customize" element={<Customize />}></Route>
        <Route path="/how-it-works" element={<HowItWorks />}></Route>
        <Route path="/about" element={<AboutUs />}></Route>
        <Route path="/zaps/:shortId" element={<ViewZap />} />
      </Routes>
      <Analytics />
    </>
  );
}
