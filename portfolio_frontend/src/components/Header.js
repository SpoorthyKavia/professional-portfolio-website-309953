import React, { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../App.css';

function linkClass({ isActive }) {
  return isActive ? 'navLink navLinkActive' : 'navLink';
}

// PUBLIC_INTERFACE
export default function Header() {
  /** Sticky header with desktop nav and collapsible mobile menu. */
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu on navigation
  useMemo(() => {
    setOpen(false);
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <header className="header" role="banner">
      <div className="container headerInner">
        <a className="brand" href="/" aria-label="Go to homepage">
          <span className="brandMark" aria-hidden="true" />
          <span>Professional Portfolio</span>
        </a>

        <nav className="nav" aria-label="Primary navigation">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          <NavLink to="/contact" className="navCta">
            Let’s talk
          </NavLink>
        </nav>

        <button
          type="button"
          className="mobileToggle"
          aria-label="Toggle navigation menu"
          aria-expanded={open ? 'true' : 'false'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <div className="mobilePanel" role="region" aria-label="Mobile navigation">
          <div className="mobilePanelInner container">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
