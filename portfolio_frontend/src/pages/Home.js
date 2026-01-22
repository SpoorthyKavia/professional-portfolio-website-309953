import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, fetchSkills } from '../api/client';
import '../App.css';

function projectCard(p) {
  return (
    <div key={p.id} className="card">
      <div className="cardTitle">{p.title}</div>
      <p className="cardText">{p.description}</p>
      <div className="tags">
        {(p.tags || []).slice(0, 6).map((t, idx) => (
          <span key={`${p.id}-tag-${idx}`} className={idx % 2 === 0 ? 'tag' : 'tag tagAlt'}>
            {t}
          </span>
        ))}
      </div>
      {p.link ? (
        <div style={{ marginTop: 12 }}>
          <a className="navCta" href={p.link} target="_blank" rel="noreferrer">
            View project
          </a>
        </div>
      ) : null}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page: hero and previews for skills/projects. */
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const previewProjects = useMemo(() => projects.slice(0, 3), [projects]);
  const previewSkills = useMemo(() => skills.slice(0, 8), [skills]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [p, s] = await Promise.all([fetchProjects(), fetchSkills()]);
        if (!mounted) return;
        setProjects(Array.isArray(p?.projects) ? p.projects : Array.isArray(p) ? p : []);
        setSkills(Array.isArray(s?.skills) ? s.skills : Array.isArray(s) ? s : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load portfolio data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="heroCard">
            <div className="kicker">Modern • Responsive • Easy to maintain</div>
            <h1 className="h1">Showcase your work with a clean, professional portfolio.</h1>
            <p className="lead">
              This template includes pages for About, Projects, and Contact, plus a backend API for
              content and contact submissions. Update a few JSON objects and you’re done.
            </p>

            <div className="heroActions">
              <Link className="btn btnPrimary" to="/projects">
                Browse projects
              </Link>
              <Link className="btn btnSecondary" to="/contact">
                Contact me
              </Link>
            </div>

            {error ? (
              <div className="alert alertError" style={{ marginTop: 16 }}>
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionTitleRow">
            <h2 className="h2">Skills snapshot</h2>
            <span className="smallNote">Fetched from backend API</span>
          </div>

          {loading ? (
            <div className="card">
              <p className="cardText">Loading…</p>
            </div>
          ) : (
            <div className="card">
              <div className="tags">
                {previewSkills.map((s, idx) => (
                  <span key={`skill-${idx}`} className={idx % 2 === 0 ? 'tag' : 'tag tagAlt'}>
                    {s}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Link className="navCta" to="/about">
                  More about me
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionTitleRow">
            <h2 className="h2">Featured projects</h2>
            <Link className="navCta" to="/projects">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="card">
              <p className="cardText">Loading…</p>
            </div>
          ) : (
            <div className="grid grid3">{previewProjects.map(projectCard)}</div>
          )}
        </div>
      </section>
    </>
  );
}
