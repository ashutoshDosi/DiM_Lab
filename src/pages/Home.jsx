import { useEffect } from "react";
import { Link } from "react-router-dom";
import { logEvent } from "../lib/tracker";

export default function Home() {
  useEffect(() => {
    logEvent("page_view", { page: "home" });
  }, []);

  return (
    <div className="page page-home">
      <section className="hero">
        <h1>Smarter Irrigation for Sugarcane, Drop by Drop</h1>
        <p>
          Sugarcane is one of the thirstiest crops grown in India, and most
          farms still irrigate on a fixed calendar rather than on what the
          crop and the soil actually need. That mismatch shows up two ways:
          <strong> over-irrigation</strong>, which wastes a scarce resource,
          leaches nutrients, and encourages waterlogging and disease, and
          <strong> under-irrigation</strong>, which stresses the cane during
          critical growth stages and cuts yield and sugar recovery.
        </p>
        <p>
          The Irrigation Advisory System gives growers a fast, rule-based way
          to check whether it's time to irrigate, how much water to apply,
          and why &mdash; using the crop's growth stage, soil type, days
          since the last watering, and recent rainfall. It's not a
          replacement for agronomic judgment or on-farm sensors, but a
          lightweight decision aid that nudges irrigation timing back toward
          what the crop actually needs, helping conserve water without
          sacrificing yield.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/advisory">
            Get an Advisory
          </Link>
          <Link className="btn btn-secondary" to="/schedule">
            View Irrigation Schedule
          </Link>
        </div>
      </section>

      <section className="home-links">
        <h2>Explore the System</h2>
        <div className="card-grid">
          <Link className="card" to="/advisory">
            <h3>Advisory</h3>
            <p>Answer four quick questions and get a tailored irrigation recommendation.</p>
          </Link>
          <Link className="card" to="/schedule">
            <h3>Schedule</h3>
            <p>A stage-wise reference schedule for sugarcane irrigation timing.</p>
          </Link>
          <Link className="card" to="/resources">
            <h3>Resources</h3>
            <p>Best practices and water-conservation tips, plus drip vs. flood irrigation.</p>
          </Link>
          <Link className="card" to="/calculator">
            <h3>Water Calculator</h3>
            <p>Estimate water and cost savings from switching flood irrigation to drip.</p>
          </Link>
          <Link className="card" to="/fertilizer">
            <h3>Fertilizer Calculator</h3>
            <p>Get a stage-appropriate nitrogen dose estimate for your field.</p>
          </Link>
          <Link className="card" to="/about">
            <h3>About</h3>
            <p>Why this project exists and who built it.</p>
          </Link>
          <Link className="card" to="/analytics">
            <h3>Analytics</h3>
            <p>See how this site is being used, tracked entirely in your browser.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
