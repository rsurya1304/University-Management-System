const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const SESSION_KEY = 'university-session';

export function getApiBase() {
  return API_BASE;
}

export async function warmUpApi() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function apiRequest(path, options = {}) {
  const retries = Number.isInteger(options.retries) ? options.retries : 0;
  return requestWithRetry(path, options, retries);
}

async function requestWithRetry(path, options, retriesRemaining) {
  try {
    return await requestOnce(path, options);
  } catch (error) {
    if (retriesRemaining > 0 && error.transient) {
      await delay(2500);
      return requestWithRetry(path, options, retriesRemaining - 1);
    }
    throw error;
  }
}

async function requestOnce(path, options = {}) {
  const token = getStoredToken();
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (networkError) {
    const error = new Error(
      'Server is starting or temporarily unavailable. Please wait a moment and try again.'
    );
    error.transient = true;
    throw error;
  }

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    if (response.status === 401) {
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new Event('university-session-expired'));
    }
    const error = new Error(
      errorPayload?.message ||
        errorPayload?.error ||
        `Request failed with status ${response.status}`
    );
    error.transient = response.status >= 502 || response.status === 408 || response.status === 429;
    throw error;
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getStoredToken() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))?.token || '';
  } catch {
    return '';
  }
}
