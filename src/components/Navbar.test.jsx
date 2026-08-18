import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

function renderNavbar(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("renders a link for every page, including the calculators", () => {
    renderNavbar();

    [
      "Home",
      "Advisory",
      "Schedule",
      "Resources",
      "Water Calculator",
      "Fertilizer Calculator",
      "About",
      "Analytics",
    ].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    });
  });

  it("marks the link matching the current route as active", () => {
    renderNavbar("/calculator");

    expect(screen.getByRole("link", { name: "Water Calculator" })).toHaveClass("active");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("active");
  });

  it("only marks Home active on the exact root path", () => {
    renderNavbar("/advisory");

    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("active");
    expect(screen.getByRole("link", { name: "Advisory" })).toHaveClass("active");
  });
});
