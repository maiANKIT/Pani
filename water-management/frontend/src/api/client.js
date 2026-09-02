const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

/**
 * Thin fetch wrapper for the Aquora API.
 * Pass `isForm: true` when sending a FormData body (e.g. report photo upload).
 */
export async function api(path, { method = "GET", body, isForm = false, token } = {}) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isForm && body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export { API_BASE };
