import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { logEvent } from "../lib/tracker";
import Resources from "./Resources";

jest.mock("../lib/tracker", () => ({
  logEvent: jest.fn(),
}));

describe("Resources page", () => {
  it("renders the drip vs. flood comparison table", () => {
    render(<Resources />);

    expect(screen.getByRole("heading", { name: "Drip vs. Flood Irrigation" })).toBeInTheDocument();
    expect(screen.getByText("Water use efficiency")).toBeInTheDocument();
  });

  it("logs an event when an external resource link is clicked", async () => {
    const user = userEvent.setup();
    render(<Resources />);

    await user.click(screen.getByRole("link", { name: "FAO — Sugarcane Water Management" }));

    expect(logEvent).toHaveBeenCalledWith("resource_link_clicked", {
      link: "FAO — Sugarcane Water Management",
    });
  });
});
