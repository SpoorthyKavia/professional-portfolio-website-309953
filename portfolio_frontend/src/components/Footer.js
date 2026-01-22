import React from 'react';
import '../App.css';

// PUBLIC_INTERFACE
export default function Footer() {
  /** Footer displayed on all pages. */
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footerInner">
        <div>© {year} Professional Portfolio</div>
        <div>
          Built with React • <span style={{ color: '#3b82f6', fontWeight: 700 }}>#3b82f6</span> &amp;{' '}
          <span style={{ color: '#06b6d4', fontWeight: 700 }}>#06b6d4</span>
        </div>
      </div>
    </footer>
  );
}
