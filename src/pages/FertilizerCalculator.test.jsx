import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { calculateFertilizerDose } from "./FertilizerCalculator";
import FertilizerCalculator from "./FertilizerCalculator";

describe("calculateFertilizerDose", () => {
  it("computes the dose for a mid-stage crop on medium organic matter", () => {
    // 250 * 0.35 (tillering) * 1 ha * 1.0 (medium) = 87.5 -> 88
    const result = calculateFertilizerDose({
      stage: "tillering",
      fieldSizeHectares: 1,
      organicMatter: "medium",
    });

    expect(result.doseKg).toBe(88);
    expect(result.stage).toBe("tillering");
    expect(result.stageLabel).toBe("Tillering (35-100 days)");
  });

  it("reduces the dose on high organic-matter soil", () => {
    // 250 * 0.35 * 1 * 0.85 = 74.375 -> 74
    const result = calculateFertilizerDose({
      stage: "tillering",
      fieldSizeHectares: 1,
      organicMatter: "high",
    });

    expect(result.doseKg).toBe(74);
  });

  it("increases the dose on low organic-matter soil", () => {
    // 250 * 0.35 * 1 * 1.1 = 96.25 -> 96
    const result = calculateFertilizerDose({
      stage: "tillering",
      fieldSizeHectares: 1,
      organicMatter: "low",
    });

    expect(result.doseKg).toBe(96);
  });

  it("scales with field size", () => {
    const one = calculateFertilizerDose({ stage: "grand_growth", fieldSizeHectares: 1, organicMatter: "medium" });
    const three = calculateFertilizerDose({ stage: "grand_growth", fieldSizeHectares: 3, organicMatter: "medium" });

    expect(three.doseKg).toBe(one.doseKg * 3);
  });

  it("gives the lowest dose for the maturity stage among all stages", () => {
    const stages = ["germination", "tillering", "grand_growth", "maturity"];
    const doses = stages.map(
      (stage) => calculateFertilizerDose({ stage, fieldSizeHectares: 1, organicMatter: "medium" }).doseKg
    );

    expect(Math.min(...doses)).toBe(doses[doses.length - 1]);
  });

  it("returns null for an unknown growth stage", () => {
    expect(
      calculateFertilizerDose({ stage: "bogus", fieldSizeHectares: 1, organicMatter: "medium" })
    ).toBeNull();
  });

  it("returns null for an unknown organic matter level", () => {
    expect(
      calculateFertilizerDose({ stage: "tillering", fieldSizeHectares: 1, organicMatter: "bogus" })
    ).toBeNull();
  });

  it("returns null for a non-positive field size", () => {
    expect(
      calculateFertilizerDose({ stage: "tillering", fieldSizeHectares: 0, organicMatter: "medium" })
    ).toBeNull();
    expect(
      calculateFertilizerDose({ stage: "tillering", fieldSizeHectares: -2, organicMatter: "medium" })
    ).toBeNull();
  });
});

describe("FertilizerCalculator page", () => {
  it("renders the form and shows a recommended dose after submit", async () => {
    const user = userEvent.setup();
    render(<FertilizerCalculator />);

    expect(screen.getByRole("heading", { name: "Nitrogen Fertilizer Calculator" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Calculate Dose" }));

    expect(screen.getByRole("heading", { name: "Recommended Dose" })).toBeInTheDocument();
  });
});
