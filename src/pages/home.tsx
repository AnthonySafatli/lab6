import { NavLink } from "react-router-dom";

import WeatherWidget from "../components/weather-widget/weather-widget";

export default function Home() {
  return (
    <section className="container text-center text-light hero-section page-fade">
      <div className="vh-50">
        <div>
          <h1 className="display-3 fw-bold ">Hi, I'm Anthony Safatli</h1>
          <p className="lead mt-3 subtext">
            I'm a Computer Science Student at Dalhousie University
          </p>
        </div>

        <NavLink
          to="/projects"
          className="btn btn-outline-info mt-5 px-4 py-2 neon-btn"
        >
          View Projects
        </NavLink>
      </div>

      <div className="mt-5">
        <h3>The Weather in Halifax</h3>
        <WeatherWidget />
      </div>
    </section>
  );
}
