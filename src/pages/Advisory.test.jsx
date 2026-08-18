import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getAdvisory } from "./Advisory";
import Advisory from "./Advisory";

describe("getAdvisory", () => {
  it("recommends irrigating now when the interval has elapsed and rainfall is low", () => {
    const result = getAdvisory({
      stage: "tillering",
      soilType: "loamy",
      daysSinceIrrigation: 10,
      recentRainfallMm: 0,
    });

    expect(result.urgency).toBe("high");
    expect(result.message).toMatch(/Irrigate now/);
    expect(result.recommendedMm).toBe(50);
    expect(result.recommendedInterval).toBe(7);
  });

  it("caps the rainfall credit at 80% of the recommended depth rather than zeroing it out", () => {
    const result = getAdvisory({
      stage: "germination",
      soilType: "sandy",
      daysSinceIrrigation: 0,
      recentRainfallMm: 100,
    });

    // recommendedMm is 21; credit capped at 0.8 * 21 = 16.8, netMm = round(21 - 16.8) = 4
    expect(result.urgency).toBe("low");
    expect(result.recommendedMm).toBe(4);
    expect(result.message).toMatch(/No irrigation needed yet/);
  });

  it("recommends irrigating soon when within 2 days of the next interval", () => {
    const result = getAdvisory({
      stage: "grand_growth",
      soilType: "loamy",
      daysSinceIrrigation: 8,
      recentRainfallMm: 0,
    });

    expect(result.urgency).toBe("medium");
    expect(result.daysUntilNext).toBe(2);
    expect(result.message).toMatch(/Irrigate in 2 day/);
  });

  it("reports no irrigation needed yet when well before the next interval", () => {
    const result = getAdvisory({
      stage: "maturity",
      soilType: "clay",
      daysSinceIrrigation: 1,
      recentRainfallMm: 0,
    });

    expect(result.urgency).toBe("low");
    expect(result.daysUntilNext).toBeGreaterThan(2);
    expect(result.message).toMatch(/No irrigation needed yet/);
  });

  it("applies soil adjustment factors to interval and depth", () => {
    const sandy = getAdvisory({
      stage: "tillering",
      soilType: "sandy",
      daysSinceIrrigation: 0,
      recentRainfallMm: 0,
    });
    const clay = getAdvisory({
      stage: "tillering",
      soilType: "clay",
      daysSinceIrrigation: 0,
      recentRainfallMm: 0,
    });

    expect(sandy.recommendedInterval).toBe(5);
    expect(sandy.recommendedMm).toBe(43);
    expect(clay.recommendedInterval).toBe(9);
    expect(clay.recommendedMm).toBe(57);
  });

  it("caps rainfall credit at 80% of the recommended depth", () => {
    const result = getAdvisory({
      stage: "tillering",
      soilType: "loamy",
      daysSinceIrrigation: 10,
      recentRainfallMm: 1000,
    });

    // recommendedMm is 50; rainfall credit capped at 0.8 * 50 = 40, netMm = 10
    expect(result.recommendedMm).toBe(10);
  });
});

describe("Advisory page", () => {
  it("renders the form and shows a recommendation after submit", async () => {
    const user = userEvent.setup();
    render(<Advisory />);

    expect(screen.getByRole("heading", { name: "Irrigation Advisory" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Get Advisory" }));

    expect(screen.getByRole("heading", { name: "Recommendation" })).toBeInTheDocument();
  });
});
