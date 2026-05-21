const API_BASE = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "sigmagpt_token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getStoredToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseJson(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export async function register(name, email, password) {
  return parseJson(
    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
  );
}

export async function login(email, password) {
  return parseJson(
    await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  );
}

export async function fetchMe() {
  return parseJson(
    await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() })
  );
}

export async function fetchPlans() {
  return parseJson(await fetch(`${API_BASE}/auth/plans`));
}

export async function upgradePlan(plan) {
  const data = await parseJson(
    await fetch(`${API_BASE}/auth/upgrade`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ plan }),
    })
  );
  return data;
}

export async function fetchThreads() {
  const threads = await parseJson(
    await fetch(`${API_BASE}/thread`, { headers: authHeaders() })
  );
  return threads.map((thread) => ({
    threadId: thread.threadId,
    title: thread.title || "New Chat",
  }));
}

export async function fetchThreadMessages(threadId) {
  return parseJson(
    await fetch(`${API_BASE}/thread/${threadId}`, { headers: authHeaders() })
  );
}

export async function deleteThread(threadId) {
  return parseJson(
    await fetch(`${API_BASE}/thread/${threadId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  );
}

export async function sendChat(threadId, message) {
  const data = await parseJson(
    await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ threadId, message }),
    })
  );
  return data.reply;
}
