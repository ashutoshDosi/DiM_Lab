import { useEffect, useState } from "react";
import { logEvent } from "../lib/tracker";

const STAGE_INFO = {
  germination: { label: "Germination (0-35 days)", intervalDays: 4, baseMm: 25 },
  tillering: { label: "Tillering (35-100 days)", intervalDays: 7, baseMm: 50 },
  grand_growth: { label: "Grand Growth (100-270 days)", intervalDays: 10, baseMm: 70 },
  maturity: { label: "Maturity (270-360 days)", intervalDays: 15, baseMm: 30 },
};

const SOIL_ADJUST = {
  sandy: { label: "Sandy", intervalFactor: 0.7, mmFactor: 0.85 },
  loamy: { label: "Loamy", intervalFactor: 1, mmFactor: 1 },
  clay: { label: "Clay", intervalFactor: 1.3, mmFactor: 1.15 },
};

export function getAdvisory({ stage, soilType, daysSinceIrrigation, recentRainfallMm }) {
  const stageInfo = STAGE_INFO[stage];
  const soilAdjust = SOIL_ADJUST[soilType];

  const recommendedInterval = Math.round(stageInfo.intervalDays * soilAdjust.intervalFactor);
  const recommendedMm = Math.round(stageInfo.baseMm * soilAdjust.mmFactor);

  const rainfallCredit = Math.min(recentRainfallMm, recommendedMm * 0.8);
  const netMm = Math.max(0, Math.round(recommendedMm - rainfallCredit));
  const daysUntilNext = Math.max(0, recommendedInterval - daysSinceIrrigation);

  let message;
  let urgency;

  if (netMm === 0) {
    urgency = "low";
    message = `Recent rainfall (${recentRainfallMm}mm) has covered the crop's needs for this stage. Hold off irrigation and recheck in ${Math.max(2, daysUntilNext)} day(s).`;
  } else if (daysSinceIrrigation >= recommendedInterval) {
    urgency = "high";
    message = `Irrigate now. Apply approximately ${netMm}mm of water.`;
  } else if (daysUntilNext <= 2) {
    urgency = "medium";
    message = `Irrigate in ${daysUntilNext} day(s). Apply approximately ${netMm}mm of water.`;
  } else {
    urgency = "low";
    message = `No irrigation needed yet. Next irrigation in ~${daysUntilNext} day(s); plan for approximately ${netMm}mm.`;
  }

  return { message, urgency, recommendedMm: netMm, recommendedInterval, daysUntilNext };
}

const initialForm = {
  stage: "tillering",
  soilType: "loamy",
  daysSinceIrrigation: 5,
  recentRainfallMm: 0,
};

export default function Advisory() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);

  useEffect(() => {
    logEvent("page_view", { page: "advisory" });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "stage" || name === "soilType" ? value : Number(value),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const advisory = getAdvisory(form);
    setResult(advisory);
    logEvent("advisory_calculated", {
      stage: form.stage,
      soilType: form.soilType,
      daysSinceIrrigation: form.daysSinceIrrigation,
      recentRainfallMm: form.recentRainfallMm,
      urgency: advisory.urgency,
      recommendedMm: advisory.recommendedMm,
    });
  }

  return (
    <div className="page page-advisory">
      <h1>Irrigation Advisory</h1>
      <p className="page-intro">
        Tell us about the field and we'll give you a rule-based irrigation
        recommendation for sugarcane.
      </p>

      <form className="advisory-form" onSubmit={handleSubmit}>
        <label>
          Growth stage
          <select name="stage" value={form.stage} onChange={handleChange}>
            {Object.entries(STAGE_INFO).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Soil type
          <select name="soilType" value={form.soilType} onChange={handleChange}>
            {Object.entries(SOIL_ADJUST).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Days since last irrigation
          <input
            type="number"
            name="daysSinceIrrigation"
            min="0"
            max="60"
            value={form.daysSinceIrrigation}
            onChange={handleChange}
          />
        </label>

        <label>
          Recent rainfall (mm, last 7 days)
          <input
            type="number"
            name="recentRainfallMm"
            min="0"
            max="500"
            value={form.recentRainfallMm}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-primary">
          Get Advisory
        </button>
      </form>

      {result && (
        <div className={`advisory-result urgency-${result.urgency}`}>
          <h2>Recommendation</h2>
          <p>{result.message}</p>
          <ul className="advisory-details">
            <li>Recommended interval for this stage/soil: {result.recommendedInterval} days</li>
            <li>Suggested application: {result.recommendedMm} mm</li>
          </ul>
        </div>
      )}
    </div>
  );
}
