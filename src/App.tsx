import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UploadPage from "./components/UploadPage";
import Customize from "./components/Customize";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import ViewZap from "./components/ViewZap";
// import UrlShortenerPage from "./components/UrlShortenerPage";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/zaps/:shortId" element={<ViewZap />} />
        {/* // <Route path="/url-shortener" element={<UrlShortenerPage />} /> */}
      </Routes>
      <Analytics />
    </>
  );
}
