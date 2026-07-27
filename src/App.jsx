import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Advisory from "./pages/Advisory";
import Schedule from "./pages/Schedule";
import Resources from "./pages/Resources";
import About from "./pages/About";
import AnalyticsLocal from "./pages/Analytics";
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <HashRouter>
      <Analytics />
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
            <Route path="/analytics" element={<AnalyticsLocal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
