import "./project-card.css";
import type Project from "../../models/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-5">
          <div className="project-card-img-container">
            <img
              className="project-card-img"
              src={project.image}
              alt={"Image for " + project.title}
            />
          </div>
        </div>

        <div className="col-md-7 d-flex flex-column">
          <div className="card-body d-flex flex-column h-100 p-4">
            <h3 className="card-title mb-2">{project.title}</h3>

            <p className="card-text mb-3">{project.description}</p>

            {project.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto d-flex justify-content-between gap-2 pt-2">
              <div className="d-flex gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info neon-btn px-3"
                  >
                    Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn px-3 btn-ghost"
                  >
                    GitHub
                  </a>
                )}
              </div>
              <div className="d-flex align-items-end">
                <p className="m-0">Written By: {project.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
