const STORAGE_KEY = "irrigation_events";
const MAX_EVENTS = 500;

export function logEvent(eventName, payload = {}) {
  const events = getEvents();
  events.push({ eventName, payload, timestamp: new Date().toISOString() });
  if (events.length > MAX_EVENTS) events.shift();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function clearEvents() {
  localStorage.removeItem(STORAGE_KEY);
}
