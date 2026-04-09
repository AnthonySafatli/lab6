import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container text-center text-light hero-section page-fade">
      <h1 className="section-title mt-3">404 Not Found</h1>
      <p className="subtext">
        The route you requested does not exist in this system.
      </p>
      <NavLink to="/" className="btn btn-outline-info mt-5 px-4 py-2 neon-btn">
        Return Home
      </NavLink>
    </section>
  );
}
