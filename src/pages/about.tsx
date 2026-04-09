import { useState } from "react";
import SkillList from "../components/skill-list/skill-list";

export default function About() {
  const [tab, setTab] = useState<"about" | "skills">("about");

  return (
    <section className="container text-light py-5 page-fade">
      <h1 className="mb-4">About Me</h1>

      {/* Tabs */}
      <ul className="nav mb-4 tab">
        {(["about", "skills"] as const).map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`tab-button ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "about" ? "About" : "Skills"}
            </button>
          </li>
        ))}
      </ul>

      {/* Skills Tab */}
      {tab === "skills" && <SkillList />}

      {/* About Tab */}
      {tab === "about" && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3">Professional Bio</h3>
              <p className="card-text">
                My name is Anthony Safatli and I am a fourth-year Computer
                Science student at Dalhousie University specializing in software
                development, with a strong focus on web technologies. I have
                practical experience building scalable web applications through
                academic, co-op, and startup environments. My interests include
                computer graphics and entrepreneurship. I am currently seeking a
                software development role where I can contribute to real-world
                products and continue developing his engineering skills.
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3">Education</h3>
              <p className="mb-1">
                <strong>Dalhousie University</strong>
              </p>
              <p className="mb-1">Bachelor of Computer Science (BSc)</p>
              <p>Expected Graduation: 2026</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3">Technical Expertise</h3>
              <p>
                <strong>Languages:</strong> C#, Python, JavaScript, C, C++,
                Java, Rust
              </p>
              <p>
                <strong>Frameworks:</strong> ASP.NET, React, Vue
              </p>
              <p>
                <strong>Tools:</strong> Git, Docker, Linux
              </p>
              <p>
                <strong>Databases:</strong> PostgreSQL, Microsoft SQL Server
              </p>
              <p>
                <strong>Cloud/Deployment:</strong> VPS hosting and server
                management
              </p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3">Experience</h3>
              <ul>
                <li>
                  <strong>ImmediaC (Web Development Co-op)</strong> – Built and
                  maintained client-facing websites for multiple businesses.
                </li>
                <li>
                  <strong>Jazz Aviation (Co-op)</strong> – Worked on internal
                  web systems and tools supporting aviation operations.
                </li>
              </ul>
            </div>
          </div>

          
        </>
      )}
    </section>
  );
}
