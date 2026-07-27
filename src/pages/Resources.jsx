import { useEffect } from "react";
import { logEvent } from "../lib/tracker";

const EXTERNAL_LINKS = [
  {
    label: "FAO — Sugarcane Water Management",
    url: "https://www.fao.org/land-water/water/water-management/en/",
  },
  {
    label: "ICAR Sugarcane Breeding Institute",
    url: "https://sugarcane.icar.gov.in/",
  },
  {
    label: "Drip Irrigation Basics (USDA NRCS)",
    url: "https://www.nrcs.usda.gov/",
  },
];

export default function Resources() {
  useEffect(() => {
    logEvent("page_view", { page: "resources" });
  }, []);

  function handleLinkClick(link) {
    logEvent("resource_link_clicked", { link });
  }

  return (
    <div className="page page-resources">
      <h1>Resources &amp; Best Practices</h1>

      <section className="resource-section">
        <h2>Water Conservation Tips</h2>
        <ul>
          <li>Irrigate during early morning or late evening to reduce evaporation losses.</li>
          <li>Mulch between rows to retain soil moisture and suppress weeds.</li>
          <li>Level fields properly so water spreads evenly instead of pooling.</li>
          <li>Use soil-moisture checks (a simple hand-feel test works) before irrigating on schedule.</li>
          <li>Match irrigation depth to growth stage &mdash; over-watering in maturity wastes water and can hurt sugar content.</li>
        </ul>
      </section>

      <section className="resource-section">
        <h2>Drip vs. Flood Irrigation</h2>
        <div className="table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th></th>
                <th>Drip Irrigation</th>
                <th>Flood Irrigation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Water use efficiency</td>
                <td>High (60-90%)</td>
                <td>Low (30-50%)</td>
              </tr>
              <tr>
                <td>Setup cost</td>
                <td>High upfront investment</td>
                <td>Low upfront investment</td>
              </tr>
              <tr>
                <td>Labor</td>
                <td>Low, automatable</td>
                <td>High, manual field management</td>
              </tr>
              <tr>
                <td>Weed growth</td>
                <td>Reduced (localized wetting)</td>
                <td>Higher (whole field wetted)</td>
              </tr>
              <tr>
                <td>Best suited for</td>
                <td>Water-scarce regions, sandy soils</td>
                <td>Water-abundant regions, clay/loamy soils</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="resource-section">
        <h2>Further Reading</h2>
        <ul className="external-links">
          {EXTERNAL_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.label)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
