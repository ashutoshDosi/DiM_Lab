import { render, screen } from "@testing-library/react";
import About from "./About";

describe("About page", () => {
  it("renders the purpose, team, and contact sections", () => {
    render(<About />);

    expect(screen.getByRole("heading", { name: "About This Project" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Purpose" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Team" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Email the Team" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:dosi.ashutosh@gmail.com")
    );
  });
});
