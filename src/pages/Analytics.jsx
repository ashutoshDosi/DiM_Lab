import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { clearEvents, getEvents, logEvent } from "../lib/tracker";

export default function Analytics() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(getEvents());
    logEvent("page_view", { page: "analytics" });
    setEvents(getEvents());
  }, []);

  const stats = useMemo(() => {
    const pageViews = events.filter((e) => e.eventName === "page_view");
    const viewsPerPage = {};
    pageViews.forEach((e) => {
      const page = e.payload?.page || "unknown";
      viewsPerPage[page] = (viewsPerPage[page] || 0) + 1;
    });

    const advisoryCount = events.filter(
      (e) => e.eventName === "advisory_calculated"
    ).length;

    const chartData = Object.entries(viewsPerPage).map(([page, views]) => ({
      page,
      views,
    }));

    const recent = [...events]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    return {
      totalPageViews: pageViews.length,
      viewsPerPage,
      advisoryCount,
      chartData,
      recent,
    };
  }, [events]);

  function handleClear() {
    clearEvents();
    setEvents([]);
  }

  const maxViews = Math.max(1, ...stats.chartData.map((d) => d.views));

  return (
    <div className="page page-analytics">
      <h1>Analytics Dashboard</h1>
      <p className="page-intro">
        Usage stats derived from interaction events logged as you browse this
        site.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.totalPageViews}</span>
          <span className="stat-label">Total Page Views</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.advisoryCount}</span>
          <span className="stat-label">Advisories Calculated</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{events.length}</span>
          <span className="stat-label">Total Events Logged</span>
        </div>
      </div>

      <section className="analytics-section">
        <h2>Views per Page</h2>
        {stats.chartData.length === 0 ? (
          <p className="empty-state">No page views logged yet. Browse the site to generate data.</p>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="views" fill="#2f7d4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="bar-list" aria-hidden="true">
          {stats.chartData.map((d) => (
            <div className="bar-row" key={d.page}>
              <span className="bar-row-label">{d.page}</span>
              <div className="bar-row-track">
                <div
                  className="bar-row-fill"
                  style={{ width: `${(d.views / maxViews) * 100}%` }}
                />
              </div>
              <span className="bar-row-value">{d.views}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="analytics-section">
        <h2>Recent Activity</h2>
        {stats.recent.length === 0 ? (
          <p className="empty-state">No events yet.</p>
        ) : (
          <ul className="timeline">
            {stats.recent.map((e, i) => (
              <li key={i}>
                <span className="timeline-event">{e.eventName}</span>
                <span className="timeline-payload">
                  {Object.keys(e.payload || {}).length > 0
                    ? JSON.stringify(e.payload)
                    : ""}
                </span>
                <span className="timeline-time">
                  {new Date(e.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button type="button" className="btn btn-danger" onClick={handleClear}>
        Clear analytics data
      </button>

      <p className="analytics-note">
        Note: this dashboard reads events from this browser's{" "}
        <code>localStorage</code> only &mdash; it is per-browser, not
        cross-user, data. A production version would send these events to a
        backend (e.g. Firebase or Supabase) to aggregate analytics across all
        visitors.
      </p>
    </div>
  );
}
