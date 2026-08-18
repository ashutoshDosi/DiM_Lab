import { useEffect, useState } from "react";
import { logEvent } from "../lib/tracker";

const STAGE_N_SHARE = {
  germination: { label: "Germination (0-35 days)", share: 0.25 },
  tillering: { label: "Tillering (35-100 days)", share: 0.35 },
  grand_growth: { label: "Grand Growth (100-270 days)", share: 0.3 },
  maturity: { label: "Maturity (270-360 days)", share: 0.1 },
};

const ORGANIC_MATTER_ADJUST = {
  low: 1.1,
  medium: 1,
  high: 0.85,
};

const TOTAL_N_KG_PER_HECTARE = 250;

export function calculateFertilizerDose({ stage, fieldSizeHectares, organicMatter }) {
  const stageInfo = STAGE_N_SHARE[stage];
  const adjustFactor = ORGANIC_MATTER_ADJUST[organicMatter];

  if (!stageInfo || adjustFactor === undefined || fieldSizeHectares <= 0) {
    return null;
  }

  const baseDoseKg = TOTAL_N_KG_PER_HECTARE * stageInfo.share * fieldSizeHectares;
  const doseKg = Math.round(baseDoseKg * adjustFactor);

  return {
    stage,
    stageLabel: stageInfo.label,
    doseKg,
  };
}

const initialForm = {
  stage: "tillering",
  fieldSizeHectares: 1,
  organicMatter: "medium",
};

export default function FertilizerCalculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);

  useEffect(() => {
    logEvent("page_view", { page: "fertilizer" });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "fieldSizeHectares" ? Number(value) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const dose = calculateFertilizerDose(form);
    setResult(dose);
    logEvent("fertilizer_dose_calculated", { ...form, doseKg: dose?.doseKg ?? null });
  }

  return (
    <div className="page page-fertilizer">
      <h1>Nitrogen Fertilizer Calculator</h1>
      <p className="page-intro">
        Estimate a stage-appropriate nitrogen dose for sugarcane based on
        field size and soil organic matter.
      </p>

      <form className="advisory-form" onSubmit={handleSubmit}>
        <label>
          Growth stage
          <select name="stage" value={form.stage} onChange={handleChange}>
            {Object.entries(STAGE_N_SHARE).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Field size (hectares)
          <input
            type="number"
            name="fieldSizeHectares"
            min="0.1"
            step="0.1"
            value={form.fieldSizeHectares}
            onChange={handleChange}
          />
        </label>

        <label>
          Soil organic matter
          <select name="organicMatter" value={form.organicMatter} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <button type="submit" className="btn btn-primary">
          Calculate Dose
        </button>
      </form>

      {result && (
        <div className="advisory-result urgency-low">
          <h2>Recommended Dose</h2>
          <p>
            Apply approximately <strong>{result.doseKg} kg</strong> of nitrogen
            for the {result.stageLabel.toLowerCase()} stage.
          </p>
        </div>
      )}
    </div>
  );
}
