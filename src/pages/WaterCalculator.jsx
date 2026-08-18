import { useEffect, useState } from "react";
import { logEvent } from "../lib/tracker";

const METHOD_EFFICIENCY = {
  flood: { label: "Flood Irrigation", efficiency: 0.45 },
  drip: { label: "Drip Irrigation", efficiency: 0.85 },
};

export function calculateWaterSavings({ fieldSizeHectares, waterDepthMm, costPerKiloLiter }) {
  if (fieldSizeHectares <= 0 || waterDepthMm <= 0) {
    return null;
  }

  const grossVolumeLiters = fieldSizeHectares * waterDepthMm * 10000;
  const floodVolumeLiters = grossVolumeLiters / METHOD_EFFICIENCY.flood.efficiency;
  const dripVolumeLiters = grossVolumeLiters / METHOD_EFFICIENCY.drip.efficiency;
  const waterSavedLiters = Math.round(floodVolumeLiters - dripVolumeLiters);
  const percentSaved = Math.round((waterSavedLiters / floodVolumeLiters) * 100);
  const costSaved = Math.round((waterSavedLiters / 1000) * Math.max(0, costPerKiloLiter));

  return {
    floodVolumeLiters: Math.round(floodVolumeLiters),
    dripVolumeLiters: Math.round(dripVolumeLiters),
    waterSavedLiters,
    percentSaved,
    costSaved,
  };
}

const initialForm = {
  fieldSizeHectares: 1,
  waterDepthMm: 50,
  costPerKiloLiter: 15,
};

export default function WaterCalculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);

  useEffect(() => {
    logEvent("page_view", { page: "calculator" });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const savings = calculateWaterSavings(form);
    setResult(savings);
    logEvent("water_savings_calculated", {
      ...form,
      waterSavedLiters: savings?.waterSavedLiters ?? null,
    });
  }

  return (
    <div className="page page-calculator">
      <h1>Water Savings Calculator</h1>
      <p className="page-intro">
        Estimate how much water and money a field could save by switching
        from flood to drip irrigation at a given application depth.
      </p>

      <form className="advisory-form" onSubmit={handleSubmit}>
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
          Water depth per irrigation (mm)
          <input
            type="number"
            name="waterDepthMm"
            min="1"
            value={form.waterDepthMm}
            onChange={handleChange}
          />
        </label>

        <label>
          Water cost (&#8377; per 1000 L)
          <input
            type="number"
            name="costPerKiloLiter"
            min="0"
            value={form.costPerKiloLiter}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn btn-primary">
          Calculate Savings
        </button>
      </form>

      {result && (
        <div className="advisory-result urgency-low">
          <h2>Estimated Savings</h2>
          <ul className="advisory-details">
            <li>Flood irrigation would use: {result.floodVolumeLiters.toLocaleString()} L</li>
            <li>Drip irrigation would use: {result.dripVolumeLiters.toLocaleString()} L</li>
            <li>
              Water saved: {result.waterSavedLiters.toLocaleString()} L ({result.percentSaved}%)
            </li>
            <li>Estimated cost saved: &#8377;{result.costSaved.toLocaleString()}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
