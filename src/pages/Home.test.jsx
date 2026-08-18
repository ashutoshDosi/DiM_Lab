import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { getEvents } from "../lib/tracker";

describe("Home page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders a link card for every section of the site", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    [
      "Advisory",
      "Schedule",
      "Resources",
      "Water Calculator",
      "Fertilizer Calculator",
      "About",
      "Analytics",
    ].forEach((label) => {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    });
  });

  it("logs a page_view event on mount", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const events = getEvents();
    expect(events).toContainEqual(
      expect.objectContaining({ eventName: "page_view", payload: { page: "home" } })
    );
  });
});
