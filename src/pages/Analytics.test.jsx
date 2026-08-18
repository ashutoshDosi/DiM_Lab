import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Analytics from "./Analytics";
import { logEvent } from "../lib/tracker";

describe("Analytics page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("logs its own page view on mount and reflects it in the stats", () => {
    render(<Analytics />);

    // visiting the page itself logs one page_view event, so nothing starts truly empty
    expect(screen.getByText("page_view")).toBeInTheDocument();
    expect(screen.getByText("Advisories Calculated")).toBeInTheDocument();
  });

  it("reflects previously logged events in the stat grid alongside its own view", () => {
    logEvent("page_view", { page: "home" });
    logEvent("advisory_calculated", { urgency: "high" });

    render(<Analytics />);

    // total page views includes the "home" view above plus this page's own view
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("clears all events when the clear button is clicked", async () => {
    const user = userEvent.setup();
    logEvent("page_view", { page: "home" });
    render(<Analytics />);

    await user.click(screen.getByRole("button", { name: "Clear analytics data" }));

    expect(screen.getByText("No events yet.")).toBeInTheDocument();
    expect(screen.getByText("No page views logged yet. Browse the site to generate data.")).toBeInTheDocument();
  });
});
