import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../App.css';

// PUBLIC_INTERFACE
export default function Layout({ children }) {
  /** Shared layout wrapper used by all routes. */
  return (
    <div className="page">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
