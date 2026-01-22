/**
 * Simple fetch wrapper for the portfolio backend.
 * Backend is expected to run on port 3001.
 */

const DEFAULT_API_BASE_URL = 'http://localhost:3001';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Return the API base URL (can be overridden by REACT_APP_API_BASE_URL). */
  return process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
}

async function request(path, options = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && body.message) ||
      (typeof body === 'string' && body) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

// PUBLIC_INTERFACE
export function fetchAbout() {
  /** Fetch the about content. */
  return request('/api/about', { method: 'GET' });
}

// PUBLIC_INTERFACE
export function fetchSkills() {
  /** Fetch the skills list. */
  return request('/api/skills', { method: 'GET' });
}

// PUBLIC_INTERFACE
export function fetchProjects() {
  /** Fetch portfolio projects. */
  return request('/api/projects', { method: 'GET' });
}

// PUBLIC_INTERFACE
export function submitContactMessage(payload) {
  /** Submit a contact form message. */
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
