const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const SESSION_KEY = 'university-session';

export function getApiBase() {
  return API_BASE;
}

export async function apiRequest(path, options = {}) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(
      errorPayload?.message ||
        errorPayload?.error ||
        `Request failed with status ${response.status}`
    );
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

function getStoredToken() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))?.token || '';
  } catch {
    return '';
  }
}
