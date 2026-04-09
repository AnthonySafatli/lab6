import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export default function Header() {
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "Messages", path: "/messages" },
  ];

  const { theme, toggle } = useTheme();

  return (
    <nav
      className={`navbar navbar-expand-lg ${theme == "dark" ? "navbar-dark" : "navbar-light"} bg-transparent px-4`}
    >
      <NavLink className="navbar-brand fw-bold brand-text" to="/">
        Portfolio
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-end gap-5"
        id="navbarNav"
      >
        <button className="btn btn-ghost theme-switcher" onClick={toggle}>
          {theme === "dark" ? "☀" : "☾"}
        </button>

        <ul className="navbar-nav">
          {links.map((item) => (
            <li className="nav-item" key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link nav-tech me-2 ${isActive ? "active-link" : ""}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
