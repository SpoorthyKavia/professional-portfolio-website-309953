import React, { useEffect, useState } from 'react';
import { fetchAbout, fetchSkills } from '../api/client';
import '../App.css';

// PUBLIC_INTERFACE
export default function About() {
  /** About page: about content and skills list fetched from backend. */
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [a, s] = await Promise.all([fetchAbout(), fetchSkills()]);
        if (!mounted) return;

        setAbout(a?.about || a || null);
        setSkills(Array.isArray(s?.skills) ? s.skills : Array.isArray(s) ? s : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load about content.');
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
    <section className="section">
      <div className="container">
        <div className="sectionTitleRow">
          <h2 className="h2">About</h2>
          <span className="smallNote">Simple JSON-driven content</span>
        </div>

        {error ? <div className="alert alertError">{error}</div> : null}

        {loading ? (
          <div className="card">
            <p className="cardText">Loading…</p>
          </div>
        ) : (
          <div className="grid grid2">
            <div className="card">
              <h3 className="cardTitle">{about?.headline || 'Hi, I’m a developer.'}</h3>
              <p className="cardText">{about?.bio || 'Add your bio in the backend data.'}</p>

              {Array.isArray(about?.highlights) && about.highlights.length ? (
                <div className="tags">
                  {about.highlights.map((h, idx) => (
                    <span key={`hl-${idx}`} className={idx % 2 === 0 ? 'tag' : 'tag tagAlt'}>
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="card">
              <h3 className="cardTitle">Skills</h3>
              <p className="cardText">A few tools and technologies I use.</p>
              <div className="tags">
                {skills.map((s, idx) => (
                  <span key={`skill-${idx}`} className={idx % 2 === 0 ? 'tag' : 'tag tagAlt'}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
