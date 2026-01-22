import React, { useEffect, useMemo, useState } from 'react';
import { fetchProjects } from '../api/client';
import '../App.css';

function ProjectCard({ project }) {
  return (
    <div className="card">
      <div className="cardTitle">{project.title}</div>
      <p className="cardText">{project.description}</p>

      <div className="tags">
        {(project.tags || []).map((t, idx) => (
          <span key={`${project.id}-tag-${idx}`} className={idx % 2 === 0 ? 'tag' : 'tag tagAlt'}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {project.link ? (
          <a className="navCta" href={project.link} target="_blank" rel="noreferrer">
            Live / Demo
          </a>
        ) : null}
        {project.source ? (
          <a className="navCta" href={project.source} target="_blank" rel="noreferrer">
            Source
          </a>
        ) : null}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Projects() {
  /** Projects page: displays all projects from backend. */
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const p = await fetchProjects();
        if (!mounted) return;
        setProjects(Array.isArray(p?.projects) ? p.projects : Array.isArray(p) ? p : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load projects.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) => {
      const hay = `${p.title || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query]);

  return (
    <section className="section">
      <div className="container">
        <div className="sectionTitleRow">
          <h2 className="h2">Projects</h2>
          <span className="smallNote">{projects.length} total</span>
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <label className="fieldLabel" htmlFor="projectSearch">
            Search projects
          </label>
          <input
            id="projectSearch"
            className="fieldInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. React, API, Dashboard…"
          />
        </div>

        {error ? <div className="alert alertError">{error}</div> : null}

        {loading ? (
          <div className="card">
            <p className="cardText">Loading…</p>
          </div>
        ) : filtered.length ? (
          <div className="grid grid3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="card">
            <p className="cardText">No projects match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
