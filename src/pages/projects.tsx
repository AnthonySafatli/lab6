import type Project from "../models/project";
import ProjectCard from "../components/project-card/project-card";
import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProjects() {
    try {
      setLoading(true);

      const projectsRes = await fetch("/projects.json");
      const projectsJson = await projectsRes.json();

      const data: Project[] = projectsJson;
      setProjects(data);
    } catch (err) {
      setError("Failed to fetch projects :(");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section className="container text-light py-5 page-fade">
      <h1>My Projects</h1>
      <p>A selection of things I've built and that I am proud of</p>

      {loading ? (
        <div className="spinner-border mt-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : error ? (
        <div className="w-100 text-center mt-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="mt-5 pb-5">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
