import { useEffect } from "react";
import { Link } from "react-router-dom";
import { logEvent } from "../lib/tracker";

const SCHEDULE = [
  {
    stage: "Germination",
    period: "0 - 35 days",
    interval: "Every 3-5 days",
    depth: "20-30 mm",
    notes: "Keep soil consistently moist; avoid waterlogging around setts.",
  },
  {
    stage: "Tillering",
    period: "35 - 100 days",
    interval: "Every 6-8 days",
    depth: "40-60 mm",
    notes: "Encourage healthy tiller development without water stress.",
  },
  {
    stage: "Grand Growth",
    period: "100 - 270 days",
    interval: "Every 8-12 days",
    depth: "60-80 mm",
    notes: "Peak water demand; deficits here hit yield the hardest.",
  },
  {
    stage: "Maturity / Ripening",
    period: "270 - 360 days",
    interval: "Every 12-18 days",
    depth: "20-35 mm",
    notes: "Taper off irrigation to boost sugar (sucrose) accumulation.",
  },
];

export default function Schedule() {
  useEffect(() => {
    logEvent("page_view", { page: "schedule" });
  }, []);

  return (
    <div className="page page-schedule">
      <h1>Stage-Wise Irrigation Schedule</h1>
      <p className="page-intro">
        A general reference schedule for sugarcane irrigation. Actual timing
        should be adjusted for local soil, climate, and rainfall &mdash; use
        the <Link to="/advisory">Advisory tool</Link> for a tailored estimate.
      </p>

      <div className="table-wrap">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Growth Stage</th>
              <th>Approx. Period</th>
              <th>Irrigation Interval</th>
              <th>Water Depth</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row) => (
              <tr key={row.stage}>
                <td>{row.stage}</td>
                <td>{row.period}</td>
                <td>{row.interval}</td>
                <td>{row.depth}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
