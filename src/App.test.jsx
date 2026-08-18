import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("@vercel/analytics/react", () => ({
  Analytics: () => null,
}));

function renderAtHash(hash) {
  window.location.hash = hash;
  return render(<App />);
}

describe("App routing", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it.each([
    ["#/", "Smarter Irrigation for Sugarcane, Drop by Drop"],
    ["#/advisory", "Irrigation Advisory"],
    ["#/schedule", "Stage-Wise Irrigation Schedule"],
    ["#/resources", "Resources & Best Practices"],
    ["#/calculator", "Water Savings Calculator"],
    ["#/fertilizer", "Nitrogen Fertilizer Calculator"],
    ["#/about", "About This Project"],
    ["#/analytics", "Analytics Dashboard"],
  ])("renders the right page heading for %s", (hash, expectedHeading) => {
    renderAtHash(hash);

    expect(screen.getByRole("heading", { level: 1, name: expectedHeading })).toBeInTheDocument();
  });

  it("always renders the navbar and footer around the routed page", () => {
    renderAtHash("#/about");

    expect(screen.getByText("Sugarcane Irrigation Advisory")).toBeInTheDocument();
    expect(screen.getByText(/a student project for water-conscious farming/)).toBeInTheDocument();
  });
});
