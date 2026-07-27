import { useEffect } from "react";
import { logEvent } from "../lib/tracker";

export default function About() {
  useEffect(() => {
    logEvent("page_view", { page: "about" });
  }, []);

  function handleContactClick() {
    logEvent("contact_opened");
  }

  return (
    <div className="page page-about">
      <h1>About This Project</h1>

      <section className="about-section">
        <h2>Purpose</h2>
        <p>
          Sugarcane accounts for a disproportionate share of agricultural
          water use in many growing regions, and irrigation decisions are
          often made by fixed habit rather than by what the crop and soil
          actually need. This project is a lightweight, rule-based advisory
          tool built to help students, growers, and extension workers reason
          about irrigation timing and depth using a few simple field inputs
          &mdash; growth stage, soil type, days since last watering, and
          recent rainfall &mdash; with the goal of reducing both water waste
          and yield-damaging under-irrigation.
        </p>
      </section>

      <section className="about-section">
        <h2>Team</h2>
        <p>
          Built as a student project exploring web-based decision-support
          tools for agriculture, combining basic agronomy reference data with
          a small React application.
        </p>
      </section>

      <section className="about-section">
        <h2>Contact</h2>
        <p>
          Questions, feedback, or suggestions? Reach out by email.
        </p>
        <a
          className="btn btn-secondary"
          href="mailto:dosi.ashutosh@gmail.com?subject=Irrigation%20Advisory%20System"
          onClick={handleContactClick}
        >
          Email the Team
        </a>
      </section>
    </div>
  );
}
