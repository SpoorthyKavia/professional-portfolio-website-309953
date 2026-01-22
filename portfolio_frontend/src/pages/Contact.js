import React, { useMemo, useState } from 'react';
import { submitContactMessage } from '../api/client';
import '../App.css';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

// PUBLIC_INTERFACE
export default function Contact() {
  /** Contact page: contact form posting to backend. */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ type: '', text: '' });

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!isValidEmail(email)) return false;
    if (message.trim().length < 10) return false;
    return true;
  }, [name, email, message]);

  async function onSubmit(e) {
    e.preventDefault();
    setResult({ type: '', text: '' });

    if (!canSubmit) {
      setResult({ type: 'error', text: 'Please complete all fields (message min 10 chars).' });
      return;
    }

    try {
      setSubmitting(true);
      await submitContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      setResult({ type: 'success', text: 'Message sent. Thanks — I will get back to you soon.' });
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setResult({ type: 'error', text: err?.message || 'Failed to send message.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="sectionTitleRow">
          <h2 className="h2">Contact</h2>
          <span className="smallNote">Sends a message to the backend</span>
        </div>

        <div className="grid grid2">
          <div className="card">
            <h3 className="cardTitle">Let’s work together</h3>
            <p className="cardText">
              Use this form to send a message. The backend stores the message in memory (easy to swap
              for a database later).
            </p>

            <div className="tags" style={{ marginTop: 12 }}>
              <span className="tag">React</span>
              <span className="tag tagAlt">Express</span>
              <span className="tag">REST API</span>
              <span className="tag tagAlt">Responsive</span>
            </div>
          </div>

          <div className="card">
            {result.type ? (
              <div className={`alert ${result.type === 'success' ? 'alertSuccess' : 'alertError'}`}>
                {result.text}
              </div>
            ) : null}

            <form className="form" onSubmit={onSubmit} style={{ marginTop: result.type ? 12 : 0 }}>
              <div>
                <label className="fieldLabel" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="fieldInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="fieldLabel" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  className="fieldInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="fieldLabel" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  className="fieldTextArea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project…"
                />
              </div>

              <button className="btn btnPrimary" type="submit" disabled={!canSubmit || submitting}>
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
