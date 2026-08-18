import { clearEvents, getEvents, logEvent } from "./tracker";

describe("tracker", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty array when no events are stored", () => {
    expect(getEvents()).toEqual([]);
  });

  it("appends a logged event with name, payload, and timestamp", () => {
    logEvent("page_view", { page: "home" });

    const events = getEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ eventName: "page_view", payload: { page: "home" } });
    expect(typeof events[0].timestamp).toBe("string");
    expect(Number.isNaN(new Date(events[0].timestamp).getTime())).toBe(false);
  });

  it("defaults payload to an empty object when omitted", () => {
    logEvent("contact_opened");

    expect(getEvents()[0].payload).toEqual({});
  });

  it("accumulates multiple events in order", () => {
    logEvent("page_view", { page: "home" });
    logEvent("page_view", { page: "about" });

    const events = getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].payload.page).toBe("home");
    expect(events[1].payload.page).toBe("about");
  });

  it("drops the oldest event once more than 500 events are stored", () => {
    for (let i = 0; i < 500; i += 1) {
      logEvent("page_view", { page: `page-${i}` });
    }
    logEvent("page_view", { page: "overflow" });

    const events = getEvents();
    expect(events).toHaveLength(500);
    expect(events[0].payload.page).toBe("page-1");
    expect(events[events.length - 1].payload.page).toBe("overflow");
  });

  it("clears all stored events", () => {
    logEvent("page_view", { page: "home" });
    clearEvents();

    expect(getEvents()).toEqual([]);
  });

  it("returns an empty array when stored data is corrupted", () => {
    localStorage.setItem("irrigation_events", "not-json");

    expect(getEvents()).toEqual([]);
  });
});
