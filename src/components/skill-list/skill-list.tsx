import "./skill-list.css";

import { useState, useMemo } from "react";

interface Skill {
  name: string;
  cat: "CSS" | "JavaScript" | "Backend" | "Tooling" | "Design";
  desc: string;
}

const SKILLS: Skill[] = [
  {
    name: "Responsive Layout",
    cat: "CSS",
    desc: "Fluid grid and flexbox patterns that adapt across all screen sizes.",
  },
  {
    name: "CSS Variables",
    cat: "CSS",
    desc: "Theming via custom properties for seamless dark/light mode switching.",
  },
  {
    name: "Animation & Motion",
    cat: "CSS",
    desc: "Keyframe animations, transitions, and performance-safe transforms.",
  },
  {
    name: "Typography System",
    cat: "CSS",
    desc: "Font pairing, scale, and spacing for readable, branded text.",
  },
  {
    name: "React Hooks",
    cat: "JavaScript",
    desc: "useState, useEffect, and custom hooks for clean component logic.",
  },
  {
    name: "Async / Fetch",
    cat: "JavaScript",
    desc: "Promises, async/await, and error handling for API calls.",
  },
  {
    name: "DOM Manipulation",
    cat: "JavaScript",
    desc: "Selecting, modifying, and listening to elements without a framework.",
  },
  {
    name: "Module Bundling",
    cat: "JavaScript",
    desc: "Webpack, Vite, and ES modules for production builds.",
  },
  {
    name: "REST APIs",
    cat: "Backend",
    desc: "Designing and consuming RESTful endpoints with proper status codes.",
  },
  {
    name: "Authentication",
    cat: "Backend",
    desc: "JWT, sessions, OAuth flows, and secure credential handling.",
  },
  {
    name: "SQL Queries",
    cat: "Backend",
    desc: "Joins, indexes, and query optimization for relational databases.",
  },
  {
    name: "Git Workflow",
    cat: "Tooling",
    desc: "Branching strategies, rebasing, and clean commit history.",
  },
  {
    name: "Testing",
    cat: "Tooling",
    desc: "Unit, integration, and E2E tests with Jest and Playwright.",
  },
  {
    name: "Accessibility",
    cat: "Design",
    desc: "ARIA, keyboard nav, and contrast ratios for inclusive interfaces.",
  },
  {
    name: "Component Design",
    cat: "Design",
    desc: "Atomic design, props API, and reusable UI building blocks.",
  },
  {
    name: "Performance",
    cat: "Tooling",
    desc: "Core Web Vitals, lazy loading, and bundle size reduction.",
  },
];

interface Colour {
  bg: string;
  color: string;
}

interface CatColour {
  CSS: Colour;
  JavaScript: Colour;
  Backend: Colour;
  Tooling: Colour;
  Design: Colour;
}

const CAT_COLORS: CatColour = {
  CSS: { bg: "rgba(0,180,255,0.08)", color: "var(--accent)" },
  JavaScript: { bg: "rgba(255,200,0,0.10)", color: "#f5c518" },
  Backend: { bg: "rgba(0,255,160,0.08)", color: "#00ffaa" },
  Tooling: { bg: "rgba(180,180,180,0.10)", color: "#aaa" },
  Design: { bg: "rgba(200,100,255,0.10)", color: "#c96fff" },
};

export default function SkillList() {
  const [query, setQuery] = useState("");
  const [activecat, setActivecat] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(SKILLS.map((s) => s.cat))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return SKILLS.filter((s) => {
      const matchCat = activecat === "All" || s.cat === activecat;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activecat]);

  return (
    <div className="page-fade">
      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          className="contact-input"
          placeholder="search skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActivecat(cat)}
              className={
                activecat === cat
                  ? "btn-outline-info neon-btn btn btn-sm category-btn"
                  : "btn-ghost btn btn-sm category-btn"
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="filtered-grid">
          {filtered.map((skill) => {
            const colors = CAT_COLORS[skill.cat] || {
              bg: "rgba(255,255,255,0.05)",
              color: "#ccc",
            };
            return (
              <div key={skill.name} className="card">
                <div className="card-body" style={{ padding: "1rem 1.25rem" }}>
                  <div className="skill-header">
                    <span className="card-title skill-title">{skill.name}</span>
                    <span
                      className="skill-category"
                      style={{
                        background: colors.bg,
                        color: colors.color,
                        border: `1px solid ${colors.color}33`,
                      }}
                    >
                      {skill.cat}
                    </span>
                  </div>
                  <p className="skill-text">{skill.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p
          className="message-empty text-center"
          style={{ paddingTop: "2rem", color: "var(--text-secondary)" }}
        >
          no skills match — try a different search
        </p>
      )}
    </div>
  );
}
