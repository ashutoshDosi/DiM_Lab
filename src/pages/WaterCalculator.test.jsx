import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { calculateWaterSavings } from "./WaterCalculator";
import WaterCalculator from "./WaterCalculator";

describe("calculateWaterSavings", () => {
  it("computes flood/drip volumes, savings, and cost for a typical field", () => {
    const result = calculateWaterSavings({
      fieldSizeHectares: 1,
      waterDepthMm: 50,
      costPerKiloLiter: 15,
    });

    // gross = 1 * 50 * 10000 = 500000 L
    // flood = 500000 / 0.45 = 1111111.11 -> 1111111
    // drip  = 500000 / 0.85 = 588235.29 -> 588235
    expect(result.floodVolumeLiters).toBe(1111111);
    expect(result.dripVolumeLiters).toBe(588235);
    expect(result.waterSavedLiters).toBe(522876);
    expect(result.percentSaved).toBe(47);
    expect(result.costSaved).toBe(7843);
  });

  it("scales with field size", () => {
    const one = calculateWaterSavings({ fieldSizeHectares: 1, waterDepthMm: 50, costPerKiloLiter: 15 });
    const two = calculateWaterSavings({ fieldSizeHectares: 2, waterDepthMm: 50, costPerKiloLiter: 15 });

    // rounding happens per-calculation, so doubling the input only doubles the result within 1 unit
    expect(two.floodVolumeLiters).toBeGreaterThan(one.floodVolumeLiters * 1.99);
    expect(two.floodVolumeLiters).toBeLessThan(one.floodVolumeLiters * 2.01);
    expect(two.dripVolumeLiters).toBeGreaterThan(one.dripVolumeLiters * 1.99);
    expect(two.dripVolumeLiters).toBeLessThan(one.dripVolumeLiters * 2.01);
  });

  it("returns null for a non-positive field size", () => {
    expect(calculateWaterSavings({ fieldSizeHectares: 0, waterDepthMm: 50, costPerKiloLiter: 15 })).toBeNull();
    expect(calculateWaterSavings({ fieldSizeHectares: -1, waterDepthMm: 50, costPerKiloLiter: 15 })).toBeNull();
  });

  it("returns null for a non-positive water depth", () => {
    expect(calculateWaterSavings({ fieldSizeHectares: 1, waterDepthMm: 0, costPerKiloLiter: 15 })).toBeNull();
    expect(calculateWaterSavings({ fieldSizeHectares: 1, waterDepthMm: -5, costPerKiloLiter: 15 })).toBeNull();
  });

  it("treats a negative cost per kilo-liter as zero cost", () => {
    const result = calculateWaterSavings({ fieldSizeHectares: 1, waterDepthMm: 50, costPerKiloLiter: -10 });

    expect(result.costSaved).toBe(0);
  });
});

describe("WaterCalculator page", () => {
  it("renders the form and shows estimated savings after submit", async () => {
    const user = userEvent.setup();
    render(<WaterCalculator />);

    expect(screen.getByRole("heading", { name: "Water Savings Calculator" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Calculate Savings" }));

    expect(screen.getByRole("heading", { name: "Estimated Savings" })).toBeInTheDocument();
    expect(screen.getByText(/Water saved:/)).toBeInTheDocument();
  });
});
