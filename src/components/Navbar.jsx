import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/advisory", label: "Advisory" },
  { to: "/schedule", label: "Schedule" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo" aria-hidden="true">🌱</span>
        <span>Sugarcane Irrigation Advisory</span>
      </div>
      <nav className="navbar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
