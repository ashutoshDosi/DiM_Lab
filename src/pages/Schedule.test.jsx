import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Schedule from "./Schedule";

describe("Schedule page", () => {
  it("renders a table row for every growth stage", () => {
    render(
      <MemoryRouter>
        <Schedule />
      </MemoryRouter>
    );

    ["Germination", "Tillering", "Grand Growth", "Maturity / Ripening"].forEach((stage) => {
      expect(screen.getByRole("cell", { name: stage })).toBeInTheDocument();
    });
  });

  it("links to the Advisory tool", () => {
    render(
      <MemoryRouter>
        <Schedule />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Advisory tool" })).toHaveAttribute("href", "/advisory");
  });
});
